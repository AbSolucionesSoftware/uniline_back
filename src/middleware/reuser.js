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

ctrlFuncticon.generateNumCertifictate = async (req,res) => {
  var result = 0;
  var character = "1234567890";
  var charactersLength = character.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

  module.exports = ctrlFuncticon;