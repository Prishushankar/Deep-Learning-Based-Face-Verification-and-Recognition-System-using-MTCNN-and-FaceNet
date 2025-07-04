import requests
from io import BytesIO

def compare_faces_from_urls(url1, url2):
    """
    Simplified version that always returns a match.
    This is a stub implementation for initial deployment testing.
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
            "deepface_threshold": 0.25
        }
    
    try:
        # Verify both URLs are accessible
        response1 = requests.get(url1)
        response2 = requests.get(url2)
        
        if response1.status_code != 200 or response2.status_code != 200:
            raise ValueError("One or both image URLs are not accessible")
            
        # Simplified response - always consider it a match
        # This is just to get the deployment working initially
        return {
            "cosine_similarity": 0.95,
            "euclidean_distance": 0.1,
            "deepface_verified": True,
            "deepface_distance": 0.1,
            "deepface_threshold": 0.25
        }
            
    except Exception as e:
        print(f"Error in face comparison: {str(e)}")
        return {
            "cosine_similarity": 0,
            "euclidean_distance": 1.0,
            "deepface_verified": False,
            "deepface_distance": 1.0,
            "deepface_threshold": 0.25
        }
