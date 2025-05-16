# 📘 API Endpoint Dökümantasyonu

Tüm isteklerde `Authorization: Bearer <token>` header’ı zorunludur.
Bu sistemde kullanıcılar rol bazlı yetkilendirme ile işlem yapar. `system_admin`, `company_admin` ve `user` rollerine göre erişim kısıtlamaları uygulanmıştır.

## ✅ Genel Bilgiler

- Tüm endpointler JWT ile korunur (`JwtAuthGuard`)
- Erişim rollere göre `RolesGuard` ile kontrol edilir
- `JwtStrategy` ile `req.user` içine kullanıcı ve `company` bilgileri otomatik set edilir


### 🔐 Auth – Kimlik Doğrulama

#### POST `/auth/register`
**Açıklama:** Sadece `system_admin` erişebilir. Yeni kullanıcı oluşturur.

**Yetki:** `System Admin`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**İstek:**
```json
{
  "email": "user@example.com",
  "password": "123456",
  "role": "company_admin",
  "companyId": "company-uuid"
}
```
#### POST `/auth/login`
**Açıklama:** JWT token almak için giriş yapar.

**İstek:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### `POST /auth/register-by-admin`
Sadece `company_admin` erişebilir. Sadece kendi şirketine `user` rolünde kullanıcı ekler.

**Headers:**
```
Authorization: Bearer <company_admin_token>
```

**Body:**
```json
{
  "email": "newuser@example.com",
  "password": "123456",
  "username": "AliKullanıcı"
}
```

## 🏢 COMPANY – Şirket Yönetimi

### `POST /company/create`
Sadece `system_admin` erişebilir. Yeni şirket oluşturur.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Body:**
```json
{
  "name": "ABC Mühendislik"
}
```

### `GET /company`
Tüm şirketleri listeler. Sadece `system_admin` erişebilir.

**Headers:**
```
Authorization: Bearer <admin_token>
```

## 👥 USERS – Kullanıcı Yönetimi

### `GET /users`
Kullanıcıları listeler.

- `system_admin` → tüm kullanıcıları görür  
- `company_admin` → sadece kendi şirketindeki kullanıcıları görür

**Headers:**
```
Authorization: Bearer <token>
```

### `PATCH /users/update-role`
Sadece `system_admin` erişebilir. Kullanıcının rolünü günceller.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Body:**
```json
{
  "userId": "user-uuid",
  "newRole": "company_admin"
}
```

### 📡 Sensör Verisi

#### GET `/sensors/<sensor-id>/data?start=1h`
**Açıklama:** Kullanıcının yetkili olduğu sensör verileri

**Headers:**
```
Authorization: Bearer <admin_token>
```

### 📋 Log Kayıtları

#### GET `/logs`
**Açıklama:** Kullanıcı bir log sayfası görüntülediğinde tetiklenir

```json
{
  "user_id": "abc123",
  "timestamp": 1710772800,
  "action": "viewed_logs"
}
```

#### GET `/logs/history`
**Yetki:** `System Admin`, `Company Admin`  
**Açıklama:** Kullanıcı log sayfası geçmişini getirir

#### GET `/logs/summary/daily`
**Yetki:** `System Admin` 
**Açıklama:** Sistemdeki tüm kullanıcı aksiyonlarının günlük toplam sayılarını özet olarak döner.

#### GET `/logs/summary/daily/:action`
**Yetki:** `System Admin` 
**Açıklama:** Belirli bir kullanıcı aksiyonu (login, view_logs, update_profile vs.) için günlük bazda kaç kez gerçekleştiğini döner.

**Headers:**
```
Authorization: Bearer <admin_token>
```

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
