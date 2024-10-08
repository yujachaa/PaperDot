# Use Miniconda as a base image
FROM continuumio/miniconda3

# Set environment variables
ENV LANG=C.UTF-8 \
    LC_ALL=C.UTF-8

# Set the working directory in the container
WORKDIR /app_overview

# Copy the environment specification to the container
COPY environment.yml /app_overview

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
COPY . /app_overview

# Chrome 다운로드
RUN wget https://storage.googleapis.com/chrome-for-testing-public/129.0.6668.89/linux64/chrome-linux64.zip
RUN wget https://storage.googleapis.com/chrome-for-testing-public/129.0.6668.89/linux64/chromedriver-linux64.zip

RUN unzip chrome-linux64.zip
RUN unzip chromedriver-linux64.zip

# Grant execution permission to Chromedriver and Chrome binaries
RUN chmod +x /app_overview/chromedriver-linux64/chromedriver
RUN chmod +x /app_overview/chrome-linux64/chrome

# Expose the port that the FastAPI application will run on
EXPOSE 3333

# Define the command to run the application
CMD ["bash", "-c", "source activate paper-overview && uvicorn pdf_summary.codes.app:app --host 0.0.0.0 --port 3333"]
