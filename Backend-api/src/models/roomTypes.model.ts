import { Schema, model} from "mongoose";
import bcrypt from 'bcryptjs';

const roomTypeSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Tên là bắt buộc'],
            trim: true
        },
        description: {
            type: String,
            required: [true, 'Mô tả là bắt buộc'],
            trim: true,
        },
        pricePerNight: {
            type: Number,
            required: [true, 'Giá mỗi đêm là bắt buộc'],
            min: 0,
        },
        capacity: {
            type: Number,
            required: [true, 'Sức chứa tối đa là bắt buộc'],
            min: 1,
        },
        amenities: {
            type: Array,
            default: ['wifi','air conditioning','television','kitchen','bathroom','balcony','gym','pool','free parking']
        },
        images: {
            type: Array,
            default: []
        },
    },
    {
        timestamps: true,
        versionKey: false
    }
);


export default model('RoomType', roomTypeSchema);
