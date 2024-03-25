function checkChar(type, str) {
  let pattern;
  switch (type) {
    case "Allmail":
      pattern = /^[0-9a-zA-Zก-ฮะาิีุูึืเัแโไใฤๅฦๅๆำํ๊้็่์ฯ๋@. ]+$/;
      break;
    case "eng":
      pattern = /^[a-zA-Z]+$/;
      break;
    case "thai":
      pattern = /^[ก-ฮะาิีุูึืเัแโไใฤๅฦๅๆำํ๊้็่์ฯ๋]+$/;
      break;
    case "All":
      pattern = /^[0-9a-zA-Zก-ฮะาิีุูึืเัแโไใฤๅฦๅๆำํ๊้็่์ฯ๋]+$/;
      break;
    case "All/space":
      pattern = /^[0-9a-zA-Zก-ฮะาิีุูึืเัแโไใฤๅฦๅๆำํ๊้็่์ฯ๋ ]+$/;
      break;
    case "eng/thai":
      pattern = /^[a-zA-Zก-ฮะาิีุูึืเัแโไใฤๅฦๅๆำํ๊้็่์ฯ๋]+$/;
      break;
    case "pass":
      pattern = /^[0-9a-zA-Z@]+$/;
      break;
    case "num":
      pattern = /^[0-9]+$/;
      break;
    case "engnum":
      pattern = /^[0-9a-zA-Z]+$/;
      break;
    default:
      console.error(`Parameter 'type' in checkChar is required`);
      return false;
  }

  return pattern.test(str);
}

function Valid(e) {
  $(e).addClass("is-valid").removeClass("is-invalid").css("color", "black");
}

function inValid(e) {
  $(e).addClass("is-invalid").removeClass("is-valid").css("color", "red");
}

function reValid(e) {
  $(e).removeClass("is-invalid").removeClass("is-valid").css("color", "black");
}

function checkEmail(email) {
  const emailParts = email.split("@");
  if (emailParts.length !== 2) return false;
  const [firstmail, domain] = emailParts;
  if (!/^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*$/.test(firstmail)) return false;
  const domainParts = domain.split(".");
  if (domainParts.length < 2 || !domain.endsWith(".com")) return false;
  return domainParts.every((part) => /^[a-zA-Z0-9]+$/.test(part));
}
