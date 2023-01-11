function bilangan(value) {
  if (value % 2 === 0) {
    return `${value} adalah bilangan Genap`
  }
   else {
    return `${value} adalah bilangan Ganjil`
   }
}

const smk = "SMK MADINATUL QUR'AN"

module.exports = {smk, bilangan}