import requests
import time
from datetime import datetime
import urllib3

# Disable SSL verification warnings
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

BASE_URL = 'https://127.0.0.1:8000'  # Changed to http

def login():
    try:
        response = requests.post(
            f'{BASE_URL}/api/token/', 
            json={
                'username': 'alice',
                'password': 'yourPassword'
            },
            verify=False  # Disable SSL verification
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Login failed: {str(e)}")
        if hasattr(e.response, 'text'):
            print(f"Response: {e.response.text}")
        return None

def test_token_refresh():
    # 1. Login to get initial tokens
    tokens = login()
    if not tokens:
        print("Could not obtain initial tokens. Exiting...")
        return

    access_token = tokens['access']
    refresh_token = tokens['refresh']
    
    print(f"\nInitial tokens received at {datetime.now()}")
    print(f"Access: {access_token[:20]}...")
    print(f"Refresh: {refresh_token[:20]}...")
    
    # 2. Try using access token
    try:
        headers = {'Authorization': f'Bearer {access_token}'}
        response = requests.get(
            f'{BASE_URL}/api/users/profile/', 
            headers=headers,
            verify=False  # Disable SSL verification
        )
        response.raise_for_status()
        print(f"\nProfile access response: {response.status_code}")
        print(response.json())
    except requests.exceptions.RequestException as e:
        print(f"\nError accessing profile: {str(e)}")
        if hasattr(e.response, 'text'):
            print(f"Response: {e.response.text}")
    
    # 3. Wait for access token to get close to expiry
    wait_time = 25  # Adjust based on your token expiry time
    print(f"\nWaiting {wait_time} seconds for token to get close to expiry...")
    time.sleep(wait_time)
    
    # 4. Try to refresh token
    try:
        refresh_response = requests.post(
            f'{BASE_URL}/api/token/refresh/',
            json={'refresh': refresh_token},
            verify=False  # Disable SSL verification
        )
        refresh_response.raise_for_status()
        print(f"\nRefresh response at {datetime.now()}: {refresh_response.status_code}")
        print(refresh_response.json())
        
        if refresh_response.status_code == 200:
            new_tokens = refresh_response.json()
            
            # 5. Try using new access token
            try:
                new_headers = {'Authorization': f'Bearer {new_tokens["access"]}'}
                new_response = requests.get(
                    f'{BASE_URL}/api/users/profile/', 
                    headers=new_headers,
                    verify=False  # Disable SSL verification
                )
                new_response.raise_for_status()
                print(f"\nNew token profile access response: {new_response.status_code}")
                print(new_response.json())
            except requests.exceptions.RequestException as e:
                print(f"\nError accessing profile with new token: {str(e)}")
                if hasattr(e.response, 'text'):
                    print(f"Response: {e.response.text}")

    except requests.exceptions.RequestException as e:
        print(f"\nError refreshing token: {str(e)}")
        if hasattr(e.response, 'text'):
            print(f"Response: {e.response.text}")

if __name__ == '__main__':
    test_token_refresh()
