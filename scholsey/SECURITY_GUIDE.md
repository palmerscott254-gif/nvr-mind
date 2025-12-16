# Security Features Guide

## 🛡️ Overview

Your device tracking app now includes comprehensive security features to prevent theft, protect your data, and give you complete control over your devices.

## 🔐 Security Features

### 1. **Account Security**

#### Multi-Factor Authentication (2FA) - Ready for Integration
- Database fields prepared for TOTP-based 2FA
- Secret key storage with `twoFactorSecret`
- Enable/disable with `twoFactorEnabled`

#### Login Protection
- ✅ **Failed Login Tracking**: Monitors unsuccessful login attempts
- ✅ **Account Locking**: Automatically locks after 5 failed attempts
- ✅ **Last Login Tracking**: Records IP address and timestamp
- ✅ **Password Hashing**: Uses bcrypt with salt rounds

### 2. **Remote Device Control**

#### Available Commands:
- **🔒 Lock Device**: Remotely lock your device to prevent unauthorized access
- **🔓 Unlock Device**: Unlock when you recover your device
- **🚨 Alarm ON/OFF**: Trigger loud alarm to locate or deter thieves
- **📍 Locate**: Force immediate location update
- **🗑️ Wipe Data**: Permanently delete all data (requires confirmation)

#### How to Use:
1. Go to Devices page
2. Select your device
3. Use Security Controls panel (middle column)
4. Commands execute in real-time via WebSocket

### 3. **Device Status Management**

#### Security Statuses:
- **✅ Safe** (Green): Normal operation
- **⚠️ Suspicious** (Yellow): Unusual activity detected
- **🚨 Stolen** (Red): Device reported stolen - maximum security

#### Quick Actions:
- **Mark as Stolen**: 
  - Automatically increases security monitoring
  - Enables all protective features
  - Sends alerts on location changes
  
- **Mark as Safe**:
  - Unlocks device
  - Turns off alarm
  - Returns to normal operation

### 4. **Geofencing Alerts**

Create virtual boundaries around important locations:

```javascript
// Example: Create home geofence
{
  name: "Home",
  latitude: 37.7749,
  longitude: -122.4194,
  radius: 100, // meters
  alertOnEnter: true,
  alertOnExit: true
}
```

**Use Cases:**
- Get notified when device leaves/enters home
- School/work zone monitoring
- Theft detection (unexpected location changes)
- Safe zone definitions

### 5. **Activity Logging**

**Every action is tracked:**
- User logins/logouts
- Device linking/unlinking
- Commands sent to devices
- Geofence breaches
- Status changes

**View Logs:**
```
GET /devices/activity/logs
```

Shows last 100 activities with:
- Timestamp
- Action type
- Success/failure status
- IP address
- User agent
- Additional metadata

### 6. **Real-Time Alerts**

Via WebSocket, receive instant notifications for:
- 🚨 **Security Alerts**: Unauthorized access attempts
- 📍 **Geofence Violations**: Enter/exit zones
- 🔧 **Command Execution**: Lock, alarm, wipe confirmations
- 📱 **Device Updates**: Location, battery, status changes

## 🔧 API Endpoints

### Security & Control
```
POST   /devices/command              - Send remote command
GET    /devices/commands/:deviceId   - Get pending commands
POST   /devices/:id/mark-stolen      - Mark device as stolen
POST   /devices/:id/mark-safe        - Mark device as safe
```

### Geofencing
```
POST   /devices/geofence             - Create geofence
GET    /devices/geofences/list       - List all geofences
DELETE /devices/geofence/:id         - Delete geofence
```

### Activity & Audit
```
GET    /devices/activity/logs        - Get activity history
```

## 🎯 Best Practices

### For Maximum Security:

1. **Enable 2FA** (when implemented)
   - Protects against password theft
   - Requires physical device access

2. **Use Strong Passwords**
   - Minimum 12 characters
   - Mix of letters, numbers, symbols
   - Never reuse passwords

3. **Set Up Geofences**
   - Create zones for home, work, school
   - Get instant theft alerts
   - Monitor unusual movements

4. **Regular Monitoring**
   - Check activity logs weekly
   - Review failed login attempts
   - Verify device locations

5. **Act Fast on Theft**
   - Mark as stolen immediately
   - Lock device to prevent access
   - Enable alarm if in public area
   - Wipe data if containing sensitive info

### Privacy Protection:

1. **Data Encryption**
   - All passwords hashed with bcrypt
   - HTTPS recommended for production
   - JWTs expire (configure expiration)

2. **Access Control**
   - JWT authentication required
   - User can only access own devices
   - Commands verified against ownership

3. **Audit Trail**
   - All actions logged
   - IP tracking for security review
   - Timestamp every event

## 🚀 Quick Start

### Link Your Device:
1. Register/Login at `/register` or `/login`
2. Click "Link New Device"
3. Enter device name and ID
4. Device appears in dashboard

### Protect Your Device:
1. Select device from list
2. Security Controls appear in middle panel
3. Lock device by default
4. Set up geofences around important locations
5. Enable alarm if in high-risk area

### In Case of Theft:
1. **Immediately** mark device as STOLEN
2. Lock the device (prevents access)
3. Enable alarm (if safe to do so)
4. Monitor location in real-time
5. Contact authorities with location data
6. As last resort: Wipe data

## 📊 Command Status Tracking

Commands go through stages:
- **Pending**: Sent to server, awaiting device
- **Sent**: Delivered to device
- **Executed**: Device confirmed execution
- **Failed**: Error occurred

Check command status:
```javascript
const commands = await devicesApi.getPendingCommands(deviceId);
```

## 🔔 Webhook Integration (Future)

Plan for external integrations:
- Email alerts on geofence breach
- SMS notifications for theft
- Slack/Discord bot integration
- Police report automation

## ⚡ Performance & Limits

- **Activity Logs**: Last 100 entries returned
- **Location History**: Last 50 updates per device
- **Geofences**: Unlimited per user
- **Commands**: Queued and executed in order
- **WebSocket**: Real-time, sub-second updates

## 🛠️ Development Notes

### Adding New Commands:
1. Add to `CommandType` enum in `command.dto.ts`
2. Handle in `sendCommand()` method
3. Update device status accordingly
4. Emit WebSocket event

### Custom Alerts:
Use `DevicesGateway.notifySecurityAlert()`:
```typescript
this.gateway.notifySecurityAlert(userId, {
  type: 'unauthorized_access',
  deviceId: device.id,
  timestamp: new Date(),
  severity: 'high'
});
```

## 📝 License & Legal

**Important**: This app is for **legal device tracking only**. 
- Only track devices you own
- Obtain consent for tracking others' devices
- Comply with local privacy laws
- Do not use for stalking or harassment

---

**Need Help?** Contact support or review the codebase documentation.
