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

# && \
#     echo "source activate paper-rag" > ~/.bashrc

# Add Conda to the PATH environment variable
ENV PATH /opt/conda/envs/paper-rag/bin:$PATH


# Copy the application code to the container
COPY . /app_rag

# Expose the port that the FastAPI application will run on
EXPOSE 7777

# Define the command to run the application
CMD ["/opt/conda/envs/paper-rag/bin/uvicorn", "codes.app:app", "--host", "0.0.0.0", "--port", "7777"]