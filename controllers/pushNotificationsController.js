// notificationService.js
const admin = require('firebase-admin');

// Inicializa la aplicación con las credenciales de la cuenta de servicio
admin.initializeApp({
    credential: admin.credential.cert(require('../deliveryKeysPush.json')), // Cambia la ruta a tu archivo JSON
});

// Función para enviar notificaciones
const sendNotification = (token, data) => {
    const message = {
        token: token,
        notification: {
            title: data.title,
            body: data.body,
        },
        data: {
            click_action: 'FLUTTER_NOTIFICATION_CLICK',
            id_notification: data.id_notification,
        },
    };

    return admin.messaging().send(message)
        .then((response) => {
            console.log('Notificación enviada con éxito:', response);
            return response;  // Devuelve la respuesta para manejarla si es necesario
        })
        .catch((error) => {
            console.error('Error al enviar la notificación:', error);
            throw error;  // Lanza el error para que pueda ser manejado
        });
};

// Método para enviar notificaciones a múltiples dispositivos
const sendNotificationMultiples = (tokens, data) => {
    const message = {
        notification: {
            title: data.title,
            body: data.body,
        },
        data: {
            click_action: 'FLUTTER_NOTIFICATION_CLICK',
            id_notification: data.id_notification,
        },
    };

    const multicastMessage = {
        tokens: tokens,  // Lista de tokens de dispositivos
        ...message
    };

    return admin.messaging().sendEachForMulticast(multicastMessage)
        .then((response) => {
            console.log(`${response.successCount} notificaciones enviadas con éxito, ${response.failureCount} fallos`);
            if (response.failureCount > 0) {
                const failedTokens = [];
                response.responses.forEach((resp, idx) => {
                    if (!resp.success) {
                        failedTokens.push(tokens[idx]);
                    }
                });
                console.log('Tokens fallidos:', failedTokens);
            }
            return response;
        })
        .catch((error) => {
            console.error('Error al enviar notificaciones a múltiples dispositivos:', error);
            throw error;
        });
};

// Exporta la función
module.exports = { sendNotification,sendNotificationMultiples };
