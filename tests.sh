
#levantar db
docker compose -f onlyDB-compose.yaml up -d
sleep 30

# iniciar backend
cd Back-eco
export $(grep -v '^#' ../.env | xargs)
./mvnw spring-boot:run

if [ $? -ne 0 ]; then
  echo "Error: Backend failed to start."
  exit 1
  echo "error al iniciar backend, por favor inicie manualmente"

# levantar frontend
cd ../Front-eco
export $(grep -v '^#' ../.env | xargs)
npm install
echo "const config = { EXPO_IP: '${EXPO_IP}' }; export default config;" > api/config.js &&
npx expo start --host lan --port 8081