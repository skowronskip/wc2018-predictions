const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PredictionsSchema = new Schema({
  userid: {
      type: Schema.Types.ObjectId,
      ref: 'users'
  },
    username: {
      type: String
    },
    creationDate: {
      type: Date
    },
    groupPoints: {
      type: Number,
        default: 0
    },
    cupPoints: {
        type: Number,
        default: 0
    },
    groupA: [
        {
          code: String,
            place: Number,
            name: String,
            chances: Number,
            group: String,
            points: Number
        }
    ],
    groupB: [
        {
            code: String,
            place: Number,
            name: String,
            chances: Number,
            group: String,
            points: Number

        }
    ],
    groupC: [
        {
            code: String,
            place: Number,
            name: String,
            chances: Number,
            group: String,
            points: Number

        }
    ],
    groupD: [
        {
            code: String,
            place: Number,
            name: String,
            chances: Number,
            group: String,
            points: Number

        }
    ],
    groupE: [
        {
            code: String,
            place: Number,
            name: String,
            chances: Number,
            group: String,
            points: Number

        }
    ],
    groupF: [
        {
            code: String,
            place: Number,
            name: String,
            chances: Number,
            group: String,
            points: Number

        }
    ],
    groupG: [
        {
            code: String,
            place: Number,
            name: String,
            chances: Number,
            group: String,
            points: Number

        }
    ],
    groupH: [
        {
            code: String,
            place: Number,
            name: String,
            chances: Number,
            group: String,
            points: Number

        }
    ],
    roundOf16: [
        [
            {
                code: String,
                win: Boolean,
                name: String,
                chances: Number,
            }
        ]
    ],
    quaterFinals: [
        [
            {
                code: String,
                win: Boolean,
                name: String,
                chances: Number,
            }
        ]
    ],
    semiFinals: [
        [
            {
                code: String,
                win: Boolean,
                name: String,
                chances: Number
            }
        ]
    ],
    thirdPlace: [
        [
            {
                code: String,
                win: Boolean,
                name: String,
                chances: Number
            }
        ]
    ],
    final: [
        [
            {
                code: String,
                win: Boolean,
                name: String,
                chances: Number
            }
        ]
    ]
});

const Predictions = mongoose.model('predictions', PredictionsSchema);

module.exports = Predictions;
