import requests
from io import BytesIO
from PIL import Image
import numpy as np
import cv2
from deepface import DeepFace
from scipy.spatial.distance import cosine
from numpy.linalg import norm
import argparse
import pandas as pd
from itertools import combinations
from mtcnn import MTCNN
from sklearn.cluster import DBSCAN

def read_image_from_url(url):
    """Fetch image from URL and convert to RGB numpy array."""
    response = requests.get(url)
    if response.status_code != 200:
        raise ValueError(f"Failed to fetch image from {url}")
    image = Image.open(BytesIO(response.content)).convert('RGB')
    return np.array(image)

def extract_face(image_array):
    detector = MTCNN()
    results = detector.detect_faces(image_array)
    if not results:
        raise ValueError("No face detected in the image.")
    x, y, w, h = results[0]['box']
    x, y = max(0, x), max(0, y)
    face = image_array[y:y+h, x:x+w]
    return face

def compare_faces_from_urls(url1, url2):
    """
    Compare faces using image URLs without saving locally.
    """
    print(f"Comparing images from:\n- {url1}\n- {url2}")
    
    # Check for empty URLs
    if not url1.strip() or not url2.strip():
        print("One of the URLs is empty, skipping comparison")
        return {
            "cosine_similarity": 0,
            "euclidean_distance": 1.0,
            "deepface_verified": False,
            "deepface_distance": 1.0,
            "deepface_threshold": 0.25,
            "error": "Empty URL provided"
        }
    
    try:
        # Load images from URLs
        img1_array = read_image_from_url(url1)
        img2_array = read_image_from_url(url2)

        # Extract faces using MTCNN
        face1 = extract_face(img1_array)
        face2 = extract_face(img2_array)

        # Resize faces to 160x160 for Facenet
        face1 = cv2.resize(face1, (160, 160))
        face2 = cv2.resize(face2, (160, 160))

        # DeepFace embedding (Facenet)
        embedding1 = DeepFace.represent(img_path=face1, model_name="Facenet", enforce_detection=False)[0]["embedding"]
        embedding2 = DeepFace.represent(img_path=face2, model_name="Facenet", enforce_detection=False)[0]["embedding"]

        # Convert to numpy
        emb1 = np.array(embedding1)
        emb2 = np.array(embedding2)

        # Calculate similarity
        results = {}
        results["cosine_similarity"] = 1 - cosine(emb1, emb2)
        results["euclidean_distance"] = norm(emb1 - emb2)
        
        # Debug info to help track issues
        cosine_sim = results["cosine_similarity"]
        print(f"Cosine similarity: {cosine_sim:.4f} (higher is better)")

        # DeepFace verification (Facenet, but with already extracted faces)
        # DeepFace might not accept threshold as a parameter, so we call it without threshold
        verify_result = DeepFace.verify(
            img1_path=face1,
            img2_path=face2,
            model_name="Facenet",
            distance_metric="cosine",
            enforce_detection=False
        )
        
        # We'll use our own threshold of 0.25 for consistency without changing the actual logic
        threshold = 0.25
        distance = verify_result["distance"]
        verified = verify_result["verified"]
        
        # Log the result details
        print(f"DeepFace verification result: {verified}, distance: {distance:.4f}, our threshold: {threshold}")
        
        results["deepface_verified"] = verified
        results["deepface_distance"] = distance
        results["deepface_threshold"] = threshold

        return results
    except Exception as e:
        error_message = str(e)
        print(f"Error in face comparison: {error_message}")
        return {
            "cosine_similarity": 0,
            "euclidean_distance": 1.0,
            "deepface_verified": False,
            "deepface_distance": 1.0,
            "deepface_threshold": 0.25,
            "error": error_message
        }

def get_embedding(face):
    return DeepFace.represent(img_path=face, model_name="Facenet", enforce_detection=False)[0]["embedding"]

# === Preprocessing Utilities ===


def hist_eq(face):
    # Histogram equalization on each channel
    img_yuv = cv2.cvtColor(face, cv2.COLOR_RGB2YUV)
    img_yuv[:,:,0] = cv2.equalizeHist(img_yuv[:,:,0])
    img_out = cv2.cvtColor(img_yuv, cv2.COLOR_YUV2RGB)
    return img_out

def detect_color_cast(faces):
    # Detects if a significant color cast (e.g., green) is present in most faces
    # Returns True if color cast is detected
    if not faces:
        return False
    cast_count = 0
    for face in faces:
        if face is None:
            continue
        mean = np.mean(face, axis=(0,1))
        # Heuristic: if one channel is >20% higher than the mean of others, flag as cast
        max_c = np.max(mean)
        min_c = np.min(mean)
        if (max_c - min_c) > 30 and (np.argmax(mean) == 1 or np.argmax(mean) == 0 or np.argmax(mean) == 2):
            cast_count += 1
    return (cast_count / max(1, len(faces))) > 0.5

if __name__ == "__main__":
    df = pd.read_csv("attendance_image_urls1.csv")
    # Sort by Day and Shift for each registration
    df['Day_num'] = df['Day'].str.extract(r'(\d+)').astype(int)
    df['Shift_num'] = df['Shift'].str.extract(r'(\d+)').astype(int)
    registration_groups = df.sort_values(['Reg ID', 'Day_num', 'Shift_num']).groupby("Reg ID")

    comparison_results = []
    verification_summary = []


    def run_verification_pipeline(image_rows, preprocess_fn=None):
        n = len(image_rows)
        faces_cache = []
        embeddings = []
        valid_indices = []
        for i in range(n):
            img_url = image_rows.loc[i, "Image URL"]
            try:
                face = extract_face(read_image_from_url(img_url))
                if face.shape[0] < 60 or face.shape[1] < 60:
                    print(f"Face too small in {img_url}, skipping.")
                    faces_cache.append(None)
                    continue
                face = cv2.resize(face, (160, 160))
                if preprocess_fn is not None:
                    face = preprocess_fn(face)
                emb = get_embedding(face)
                faces_cache.append(face)
                embeddings.append(emb)
                valid_indices.append(i)
            except Exception as e:
                print(f"Error extracting face from {img_url}: {e}")
                faces_cache.append(None)

        # Clustering for outlier detection
        all_verified = True
        failed_at = None
        outliers = []
        if len(embeddings) > 1:
            clustering = DBSCAN(eps=0.7, min_samples=2, metric='euclidean').fit(embeddings)
            labels = clustering.labels_
            main_cluster = np.argmax(np.bincount(labels[labels != -1])) if np.any(labels != -1) else -1
            for idx, label in zip(valid_indices, labels):
                if label != main_cluster:
                    outliers.append(idx)
            if outliers:
                print(f"Outlier images detected at indices: {outliers}")
                all_verified = False
                failed_at = f"Outliers at {', '.join(str(i) for i in outliers)}"
        else:
            print("Not enough valid faces for clustering.")

        # Chain comparison as before, but skip outliers
        for i in range(n - 1):
            if i in outliers or (i+1) in outliers:
                continue
            img1_label = f"{image_rows.loc[i, 'Day']}-{image_rows.loc[i, 'Shift']}"
            img2_label = f"{image_rows.loc[i + 1, 'Day']}-{image_rows.loc[i + 1, 'Shift']}"
            face1 = faces_cache[i]
            face2 = faces_cache[i + 1]
            if face1 is None or face2 is None:
                print(f"Skipping comparison {img1_label} and {img2_label} due to missing face.")
                comparison_results.append({
                    "Reg ID": reg_id,
                    "Image 1": img1_label,
                    "Image 2": img2_label,
                    "Verified": False,
                    "Distance": None,
                    "Preprocessing": preprocess_fn.__name__ if preprocess_fn else "none"
                })
                all_verified = False
                failed_at = f"{img1_label} <> {img2_label} (face missing)"
                continue
            try:
                verify_result = DeepFace.verify(
                    img1_path=face1,
                    img2_path=face2,
                    model_name="Facenet",
                    distance_metric="cosine",
                    enforce_detection=False,
                    threshold=0.25
                )
                verified = verify_result["verified"]
                comparison_results.append({
                    "Reg ID": reg_id,
                    "Image 1": img1_label,
                    "Image 2": img2_label,
                    "Verified": verified,
                    "Distance": verify_result["distance"],
                    "Preprocessing": preprocess_fn.__name__ if preprocess_fn else "none"
                })
                print(f"Comparing: {img1_label} AND {img2_label}")
                print(f"  DeepFace Verified: {verified} (Distance: {verify_result['distance']:.4f})")
                if not verified:
                    # Try matching img2 to all other non-outlier, non-missing faces
                    match_found = False
                    for j in range(n):
                        # Do not compare the image to itself (i+1 is the index of face2)
                        if j == (i+1) or j in outliers or faces_cache[j] is None:
                            continue
                        alt_label = f"{image_rows.loc[j, 'Day']}-{image_rows.loc[j, 'Shift']}"
                        alt_verify = DeepFace.verify(
                            img1_path=faces_cache[j],
                            img2_path=face2,
                            model_name="Facenet",
                            distance_metric="cosine",
                            enforce_detection=False,
                            threshold=0.25
                        )["verified"]
                        print(f"  (Fallback) Comparing: {alt_label} AND {img2_label} => Verified: {alt_verify}")
                        if alt_verify:
                            match_found = True
                            break
                    if not match_found:
                        all_verified = False
                        failed_at = f"{img1_label} <> {img2_label} (and all others)"
            except Exception as e:
                print(f"Error comparing {img1_label} and {img2_label}: {e}")
                all_verified = False
                failed_at = f"{img1_label} <> {img2_label} (error)"
        return all_verified, failed_at, outliers, faces_cache

    for reg_id, group in registration_groups:
        print(f"\n=== Verifying images for Registration ID: {reg_id} ===")
        image_rows = group.reset_index(drop=True)
        n = len(image_rows)
        if n < 2:
            print("Not enough images to compare for this registration ID.")
            verification_summary.append({
                "Reg ID": reg_id,
                "All Verified": False,
                "Failed At": "Not enough images"
            })
            continue

        # First, run with no preprocessing to get faces for color cast detection
        faces_for_cast = []
        for i in range(n):
            img_url = image_rows.loc[i, "Image URL"]
            try:
                face = extract_face(read_image_from_url(img_url))
                if face.shape[0] < 60 or face.shape[1] < 60:
                    faces_for_cast.append(None)
                    continue
                face = cv2.resize(face, (160, 160))
                faces_for_cast.append(face)
            except Exception as e:
                faces_for_cast.append(None)

        color_cast = detect_color_cast(faces_for_cast)
        print(f"Color cast detected: {color_cast}")

        if color_cast:
            # Only use histogram equalization as the preprocessing method
            print(f"\nRunning pipeline with preprocessing: hist_eq")
            all_verified, failed_at, outliers, _ = run_verification_pipeline(image_rows, preprocess_fn=hist_eq)
            if all_verified:
                print(f"Registration {reg_id} verified by histogram equalization.")
                verification_summary.append({
                    "Reg ID": reg_id,
                    "All Verified": True,
                    "Failed At": "All Matched (hist_eq)",
                    "Outliers": ''
                })
            else:
                verification_summary.append({
                    "Reg ID": reg_id,
                    "All Verified": False,
                    "Failed At": f"{failed_at} [hist_eq]",
                    "Outliers": ','.join(str(i) for i in outliers) if outliers else ''
                })
        else:
            # Normal pipeline
            all_verified, failed_at, outliers, _ = run_verification_pipeline(image_rows, preprocess_fn=None)
            verification_summary.append({
                "Reg ID": reg_id,
                "All Verified": all_verified,
                "Failed At": failed_at if not all_verified else "All Matched",
                "Outliers": ','.join(str(i) for i in outliers) if outliers else ''
            })

    # Convert results to DataFrame for better visualization
    results_df = pd.DataFrame(comparison_results)
    summary_df = pd.DataFrame(verification_summary)

    # Save to Excel
    with pd.ExcelWriter("comparison_results.xlsx") as writer:
        results_df.to_excel(writer, sheet_name="Detailed Results", index=False)
        summary_df.to_excel(writer, sheet_name="Verification Summary", index=False)

    print("\n=== Comparison complete. Results saved to 'comparison_results.xlsx'. ===")
