export class customError extends Error {
    public errstatus: number
    public message: string
    constructor(errstatus: number, message: string) {
      super(message)
      this.errstatus = errstatus
      this.message = message
    }
  }