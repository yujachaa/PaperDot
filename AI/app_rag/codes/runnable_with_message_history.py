from dotenv import load_dotenv
import os

from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.chat_history import BaseChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import StrOutputParser

load_dotenv(dotenv_path='config/.env')
API_KEY = os.getenv("OPENAI_API_KEY")


# 프롬프트 정의
prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "당신은 Question-Answering 챗봇입니다. 주어진 질문에 대한 답변을 제공해주세요.",
        ),
        # 대화기록용 key 인 chat_history 는 가급적 변경 없이 사용하세요!
        MessagesPlaceholder(variable_name="chat_history"),
        ("human", "#Question:\n{question}"),  # 사용자 입력을 변수로 사용
    ]
)

# llm 생성
llm = ChatOpenAI(api_key=API_KEY)

# 일반 Chain 생성
chain = prompt | llm | StrOutputParser()

# 세션 기록을 저장할 딕셔너리
store = {}


# 세션 ID를 기반으로 세션 기록을 가져오는 함수
def get_session_history(session_ids):
    print(f"[대화 세션ID]: {session_ids}")
    if session_ids not in store:  # 세션 ID가 store에 없는 경우
        # 새로운 ChatMessageHistory 객체를 생성하여 store에 저장
        store[session_ids] = ChatMessageHistory()
    return store[session_ids]  # 해당 세션 ID에 대한 세션 기록 반환


chain_with_history = RunnableWithMessageHistory(
    chain,
    get_session_history,  # 세션 기록을 가져오는 함수
    input_messages_key="question",  # 사용자의 질문이 템플릿 변수에 들어갈 key
    history_messages_key="chat_history",  # 기록 메시지의 키
)

print(chain_with_history.invoke(
    # 질문 입력
    {"question": "나의 이름은 상필입니다."},
    # 세션 ID 기준으로 대화를 기록합니다.
    config={"configurable": {"session_id": "abc123"}},
))

print(store)

print(chain_with_history.invoke(
    # 질문 입력
    {"question": "내 이름이 뭐라고?"},
    # 세션 ID 기준으로 대화를 기록합니다.
    config={"configurable": {"session_id": "abc123"}},
))

