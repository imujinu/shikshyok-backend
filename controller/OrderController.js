const { Order } = require("../models");
const { getProducer, getConsumer } = require("../kafka");

exports.addOrder = async (req, res) => {
  try {
    const order = req.body;
    const producer = getProducer();
    await producer.send({
      topic: "orders",
      messages: [{ value: JSON.stringify(order) }],
    });
    console.log("Kafka 발행 완료:", order);

    const reqData = req.body;
    console.log("reqData", reqData);

    // const addedOrder = await Order.create({
    //   cus_order_id: reqData.cus_order_id,
    //   shop_order_id: reqData.shop_order_id,
    //   menuName: reqData.menuName,
    //   user_id: "as",
    //   price: reqData.price,
    //   totalPrice: reqData.totalPrice,
    //   visitors: reqData.visitors,
    //   isTakeout: reqData.isTakeout,
    //   orderTime: reqData.orderTime,
    //   option: reqData.option,
    //   progress: reqData.progress,
    //   visitTime: reqData.visitTime,
    // });

    const consumer = getConsumer();
    consumer.run({
      eachMessage: async ({ message }) => {
        const orderData = JSON.parse(message.value.toString());
        await Order.create(orderData);
        console.log("Kafka로 들어온 주문 DB 저장 완료:", orderData);
      },
    });

    res.status(200).json({ message: "주문이 완료되었습니다." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};
