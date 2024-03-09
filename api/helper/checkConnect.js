import moment from "moment-timezone"
import mongoose from "mongoose"

export const countConnect = () => {
  setInterval(() => {
    const currentTimeInVietNam = moment().tz("Asia/Ho_Chi_Minh").format()
    const numOfConnection = mongoose.connection.length
    console.info("_________START::: Count Connection_______")
    console.info(`Number of connections: ${numOfConnection}`)
    console.info(`Time logged: ${currentTimeInVietNam}`)
    console.info("_________END_______")
  })
}
