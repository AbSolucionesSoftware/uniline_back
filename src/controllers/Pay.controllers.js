const payCtrl = {};
const { model } = require("../models/Pay");
const modelPay = require("../models/Pay");
const Stripe = require("stripe");
const modelInscription = require("../models/Inscription");
const reuserFunction = require("../middleware/reuser");
const modelCart = require("../models/Cart");

const stripe = new Stripe(process.env.LLAVE_SECRETA_STRIPE);

payCtrl.createPay = async (req, res) => {
  try {
    console.log(req.body);
    const {
      idStripe,
      courses,
      username,
      idUser,
      total,
      typePay,
    } = req.body;
    const newPay = new modelPay({
      stripeObject: idStripe.id,
      idUser: idUser,
      nameUser: username,
      typePay: typePay,
      statusPay: false,
      total: total,
      amount: Math.round(100 * parseFloat(total)),
      courses: courses
    });
    await newPay.save((err, userStored) => {
      if (err) {
        res.status(500).json({ message: "Ups, algo paso", err });
      } else {
        if (!userStored) {
          res.status(404).json({ message: "Error" });
        } else {
          res
            .status(200)
            .json({ message: "Todo correcto", idPay: userStored._id });
        }
      }
    });
  } catch (error) {
    res.status(505).json({ message: "Error del servidor", error });
    console.log(error);
  }
};

payCtrl.confirmPay = async (req, res) => {
  try {
    const payBase = await modelPay.findById(req.params.idPay);
    if (payBase) {
      const payment = await stripe.paymentIntents.create({
        amount: payBase.amount,
        currency: "MXN",
        description: toString(payBase._id),
        payment_method_types: ["card"],
        payment_method: payBase.stripeObject,
        confirm: true,
      });

      console.log(payBase);

      if (payment) {
        await modelPay.findByIdAndUpdate(
          payBase._id,
          { statusPay: true, triedPayment: payment.id },
          async (err, postStored) => {
            if (err) {
              res.status(500).json({ message: "Error al crear el pago." });
            } else {
              if (!postStored) {
                res.status(500).json({ message: "Error al crear el pago." });
              } else {
                const cartUser = await modelCart.findOne({
                  idUser: payBase.idUser,
                });
                payBase.courses.map(async (course) => {
                  /* const newInscription = new modelInscription({
                    idCourse: course.idCourse,
                    idUser: payBase.idUser,
                    codeKey: "",
                    code: false,
                    priceCourse: course.priceCourse,
                    freeCourse: false,
                    promotionCourse: course.pricePromotionCourse,
                    persentagePromotionCourse: course.persentagePromotion,
                    studentAdvance: "0",
                    ending: false,
                    numCertificate: reuserFunction.generateNumCertifictate(10),
                  });
                  await newInscription.save(); */
                });
                for(z=0; z < payBase.courses.length; z++){
                  for(i=0; i < cartUser.courses.length; i++){
                    if (payBase.courses[z].idCourse == cartUser.courses[i].course) {
                      console.log("llego");
                      await modelCart.updateOne(
                        {
                          _id: cartUser._id,
                        },
                        {
                          $pull: {
                            courses: {
                              _id: cartUser.courses[i]._id,
                            },
                          },
                        }
                      );
                    }
                  }
                }
                res.status(200).json({ message: "Pago realizado" });
              }
            }
          }
        );
      } else {
        res.status(500).json({ message: "No se pudo procesar el pago." });
      }
    } else {
      res.status(404).json({ message: "Pago inexistente." });
    }
  } catch (error) {
    res.status(505).json({ message: "Error del servidor", error });
    console.log(error);
  }
};

module.exports = payCtrl;
