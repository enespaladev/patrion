# 📘 API Endpoint Dökümantasyonu

Tüm isteklerde `Authorization: Bearer <token>` header’ı zorunludur.

---

### 🔐 Auth

#### POST `/auth/login`
**Açıklama:** Kullanıcı girişi yapar.

**İstek:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}

#### Yanıt:
```json
{
  "access_token": "..."
}
```

---

### 👥 Kullanıcılar

#### GET `/users`
**Yetki:** `System Admin`

#### POST `/users`
**Yetki:** `Company Admin`  
**Açıklama:** Yeni kullanıcı oluşturur

---

### 📡 Sensör Verisi

#### GET `/sensors`
**Açıklama:** Kullanıcının yetkili olduğu sensör verileri

---

### 📋 Log Kayıtları

#### GET `/logs`
**Yetki:** `System Admin`, `Company Admin`  
**Açıklama:** Kullanıcı log sayfası geçmişini getirir

#### POST `/logs/view`
**Açıklama:** Kullanıcı bir log sayfası görüntülediğinde tetiklenir

```json
{
  "user_id": "abc123",
  "timestamp": 1710772800,
  "action": "viewed_logs"
}
```

---

### 🔗 WebSocket

**URL:** `ws://localhost:3000/ws`  
**Açıklama:** Gerçek zamanlı sensör verisi yayını

#### Mesaj Formatı:
```json
{
  "sensor_id": "temp_sensor_01",
  "temperature": 25.4,
  "humidity": 55.2
}
```
