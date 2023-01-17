// method to check whether the user has privilage to do the requested action

import { customError } from "./customError"

export default (id: string, _id:string) => {
    if (id!==_id) throw new customError(409, "update failed: You can only update your details only.")
}