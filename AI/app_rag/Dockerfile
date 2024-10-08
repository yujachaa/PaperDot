# Use Miniconda as a base image
FROM continuumio/miniconda3

# Set environment variables
ENV LANG=C.UTF-8 \
    LC_ALL=C.UTF-8

# Set the working directory in the container
WORKDIR /app_rag

# Copy the environment specification to the container
COPY environment.yml /app_rag

# Create the environment and activate it
RUN conda config --add channels defaults && \
    conda config --add channels conda-forge && \
    conda env create -f environment.yml

# Add Conda to the PATH environment variable
ENV PATH /opt/conda/envs/paper-rag/bin:$PATH

# Install necessary system packages
RUN apt-get update && apt-get install -y \
    wget \
    unzip \
    libnss3 \
    libgconf-2-4 \
    libxss1 \
    libappindicator3-1 \
    libasound2 \
    fonts-liberation \
    xdg-utils \
    libgtk-3-0 \
    libgbm-dev \
    libgl1-mesa-glx \
    libxcomposite1

# Copy the application code to the container
COPY . /app_rag

# Chrome 다운로드
RUN wget https://storage.googleapis.com/chrome-for-testing-public/129.0.6668.89/linux64/chrome-linux64.zip
RUN wget https://storage.googleapis.com/chrome-for-testing-public/129.0.6668.89/linux64/chromedriver-linux64.zip

RUN unzip chrome-linux64.zip
RUN unzip chromedriver-linux64.zip

# Grant execution permission to Chromedriver and Chrome binaries
RUN chmod +x /app_rag/chromedriver-linux64/chromedriver
RUN chmod +x /app_rag/chrome-linux64/chrome

# RUN pip install pymupdf4llm==0.0.17
# RUN pip install pdfplumber==0.11.4

# Expose the port that the FastAPI application will run on
EXPOSE 7777

# Define the command to run the application
CMD ["bash", "-c", "source activate paper-rag && uvicorn codes.app:app --host 0.0.0.0 --port 7777"]
