import requests

url = "http://localhost:8000/api/v1/timeline"
response = requests.get(url, headers={"Authorization": "Bearer TEST_TOKEN"})
print("Status Code:", response.status_code)
if response.status_code != 200:
    print("Response:", response.text)
