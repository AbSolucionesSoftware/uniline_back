const ctrlFuncticon = {};

ctrlFuncticon.generateCode = (length) => {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

ctrlFuncticon.generateNumCertifictate = async (length) => {
  var result = 0;
  for (var i = 0; i < length; i++) {
    result += Math.random(10)
  }
  return toString(result);
}

  module.exports = ctrlFuncticon;