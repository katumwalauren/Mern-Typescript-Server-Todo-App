import { Schema, model } from 'mongoose';

const someModelSchema = new Schema({
  name: { type: String, required: true },

});

const SomeModel = model('SomeModel', someModelSchema);

export default SomeModel;
