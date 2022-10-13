import { userModel } from '../../models/userSchema.js';
import mongoContainer from '../containers/mongoDb.js';
const userApi = new mongoContainer(userModel);
export default userApi;
