import { productModel } from '../../models/productsSchema.js';
import mongoContainer from '../containers/mongoDb.js';
const prodsApi = new mongoContainer(productModel);

export default prodsApi;
