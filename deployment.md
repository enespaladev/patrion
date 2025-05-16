## 🚀 Deployment Rehberi – Akıllı Sensör Takip Sistemi

Bu rehber, projenin üretim ortamına taşınmasını ve sürdürülebilir şekilde çalıştırılmasını kapsar.

---

### 📁 1. Dosya Yapısı (Önerilen)

```
patrion/
├── backend/
├── frontend/
├── docker-compose.yml
├── .env
├── nginx/
│   ├── nginx.conf
├── certs/                # TLS sertifikaları
│   ├── server.crt
│   └── server.key
└── README.md
```

---

### 🐳 2. Docker Deployment (Production)

**Docker Compose dosyası örneği:**

```yaml
version: "3.8"

services:
  postgres:
    image: postgres:15
    restart: always
    environment:
      POSTGRES_USER: ${DB_USERNAME}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    volumes:
      - db_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  influxdb:
    image: influxdb:2.7
    ports:
      - "8086:8086"
    volumes:
      - influx_data:/var/lib/influxdb2
    environment:
      - DOCKER_INFLUXDB_INIT_MODE=setup
      - DOCKER_INFLUXDB_INIT_USERNAME=admin
      - DOCKER_INFLUXDB_INIT_PASSWORD=${INFLUX_TOKEN}
      - DOCKER_INFLUXDB_INIT_ORG=${INFLUX_ORG}
      - DOCKER_INFLUXDB_INIT_BUCKET=${INFLUX_BUCKET}

  mqtt:
    image: eclipse-mosquitto
    volumes:
      - ./mosquitto:/mosquitto
    ports:
      - "1883:1883"
      - "8883:8883"

  backend:
    build: ./backend
    depends_on:
      - postgres
      - influxdb
      - mqtt
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    env_file:
      - .env

  frontend:
    build: ./frontend
    ports:
      - "3001:80"

  nginx:
    image: nginx:stable
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./certs:/etc/nginx/certs
    depends_on:
      - frontend
      - backend

volumes:
  db_data:
  influx_data:
```

---

### 🔐 3. TLS/SSL Sertifikaları

**MQTT için TLS:**

- `server.crt` ve `server.key` dosyalarını `/mosquitto/config/` içine yerleştirin.
- `mosquitto.conf` dosyasına şu satırları ekleyin:

```conf
listener 8883
cafile /mosquitto/config/ca.crt
certfile /mosquitto/config/server.crt
keyfile /mosquitto/config/server.key
require_certificate false
```

**Nginx için TLS:**

- `nginx.conf` dosyasına şunu ekleyin:

```nginx
server {
  listen 443 ssl;
  ssl_certificate /etc/nginx/certs/server.crt;
  ssl_certificate_key /etc/nginx/certs/server.key;

  location / {
    proxy_pass http://frontend:80;
  }

  location /api/ {
    proxy_pass http://backend:3000/;
  }
}
```

---

### 🗝️ 4. Ortam Değişkenleri (.env)

Üretim ortamına özel bir `.env.production` dosyası oluştur:

```env
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=strongpassword
DB_NAME=iot_db

JWT_SECRET=verystrongsecret
JWT_EXPIRES_IN=3600s

INFLUX_URL=http://influxdb:8086
INFLUX_TOKEN=production_influx_token
INFLUX_ORG=company_org
INFLUX_BUCKET=sensors

MQTT_BROKER_URL=mqtts://mqtt:8883
```

---

### 🔐 5. Güvenlik Önerileri

- Ortam değişkenlerini `.env.production` dosyasında tut, `.env` dosyasını `.gitignore` içine ekle.
- Sertifikaları repo içinde değil, sunucuda oluştur ve mount et.
- Websocket erişimini JWT ile koru.
- API rate limit uygulanmalı.

---

### 🛠️ 6. Gelişmiş (Opsiyonel)

- **Loglar için volume kullan**: `./logs:/app/logs`
- **CI/CD entegrasyonu**: GitHub Actions, GitLab CI, Jenkins gibi.
- **Veri yedeklemesi**: PostgreSQL + InfluxDB backup cronjob kurulmalı.
- **Monitor & Alerting**: Prometheus + Grafana önerilir.
