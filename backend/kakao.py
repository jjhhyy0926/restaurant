# backend/kakao.py

import os
import requests
from dotenv import load_dotenv

load_dotenv()

def get_kakao_user(access_token):
    """
    카카오 액세스 토큰으로 사용자 정보 가져오기
    """
    url = "https://kapi.kakao.com/v2/user/me"
    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    resp = requests.get(url, headers=headers)
    if resp.status_code != 200:
        return None
    return resp.json()