# backend/kakao.py

import os
import requests
from dotenv import load_dotenv

# .env에서 REST API 키 로드 (app.py에서도 load_dotenv() 했지만,
# kakao.py 단독 실행을 대비해 한 번 더 로드해 줍니다)
load_dotenv()

# 카카오 REST API 키 (사실 이 함수에선 직접 사용하지 않지만,
# 필요하다면 이 키를 이용해 사용자 정보 외 추가 API 호출도 가능합니다)
KAKAO_REST_KEY = os.getenv("4085b855dcaebe23ef0bc2104434a610")

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
