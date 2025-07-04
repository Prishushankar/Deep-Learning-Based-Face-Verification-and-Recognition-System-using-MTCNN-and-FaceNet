import requests
import json

# Test the local API
def test_local_api():
    url = "http://localhost:8001"
    
    # Test health check
    try:
        response = requests.get(f"{url}/")
        print("Health check:", response.json())
    except Exception as e:
        print("Health check failed:", e)
        return
    
    # Test compare endpoint
    test_data = {
        "urls": [
            "https://example.com/image1.jpg",
            "https://example.com/image2.jpg",
            "https://example.com/image3.jpg",
            "https://example.com/image4.jpg"
        ]
    }
    
    try:
        response = requests.post(f"{url}/compare", 
                               headers={"Content-Type": "application/json"},
                               data=json.dumps(test_data))
        print("Compare response:", response.json())
    except Exception as e:
        print("Compare test failed:", e)

if __name__ == "__main__":
    test_local_api()
