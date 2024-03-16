const amqp = require('amqplib');

async function consumeMessages() {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const queue = 'data_queue'; // Kullanılacak kuyruk adı

    await channel.assertQueue(queue, { durable: true });
    console.log(`[*] Waiting for messages in ${queue}. To exit press CTRL+C`);

    channel.consume(queue, async (msg) => {
        const content = JSON.parse(msg.content.toString());
        console.log("[x] Received", content);

        // Gelen mesajı işleyen kodlar buraya eklenecek
        // Örneğin, mesajı default kuyruğa göndermek için aşağıdaki fonksiyon çağrılabilir:
        await sendMessageToDefaultQueue(content);

    }, { noAck: true });
}

async function sendMessageToDefaultQueue(message) {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    const defaultQueue = ''; // Default kuyruk için herhangi bir isim belirtmeyin

    await channel.assertQueue(defaultQueue, { durable: true });
    await channel.sendToQueue(defaultQueue, Buffer.from(JSON.stringify(message)), { persistent: true });

    console.log(`[x] Sent message to default queue:`, message);

    await channel.close();
    await connection.close();
}

consumeMessages().catch(console.error);

