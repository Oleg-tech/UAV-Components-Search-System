echo 'Building image for UI'
docker build -t ui ./frontend
sleep 10
echo 'Building image for Backend'
docker build -t backend ./backend
sleep 10
echo 'Launching application in Docker containers'
docker-compose up --build