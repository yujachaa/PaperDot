from langchain_community.tools.tavily_search import TavilySearchResults
from langchain.tools.retriever import create_retriever_tool
from langchain import hub
from langchain_openai import ChatOpenAI
from langchain.agents import create_openai_functions_agent
from langchain.agents import AgentExecutor
from dotenv import load_dotenv
import os

load_dotenv(dotenv_path='config/.env')
API_KEY = os.getenv("TAVILY_API_KEY")

search = TavilySearchResults(k=5)

print(search.invoke("싸피 대전 캠퍼스의 위치"))

retriever_tool = create_retriever_tool(
    retriever="",
    name="pdf_search",
    description="웹 혹은 인터넷에서의 검색을 요청할 때 검색합니다."
)

tools = [search, retriever_tool]

prompt = hub.pull("hwchase17/openai-fuctions-agent")

gpt=""
# prompt.messages

agent = create_openai_functions_agent(gpt, tools, prompt)

agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

response = agent_executor.invoke(
    {"input": "대전 성심당의 위치"}
)

print(response["output"])