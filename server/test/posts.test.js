import {getPostsByCreator} from '../controllers/posts.js';
import PostMessage from '../models/postMessage.js';

const mockingoose = require('mockingoose');

describe('Books service', () => {
    describe('getPostsByCreator', () => {
      it ('should return the list of books', async () => {
        mockingoose(PostMessage).toReturn([
          {
            title: 'title 1',
            message : 'message1'
          },
          {
            title: 'title 2',
            message : 'message2'
          }
        ], 'find');

        var request = new Object();
        request.query='name1';
        var response = {
            status: function(code){
                this.code=code;
            },
            json: function(data){
                this.data=data;
            },
            getStatus: function() {
                return this.code;
            },
            getData: function() {
                return this.data;
            }
        };

        await getPostsByCreator(request, response);

        console.log("response=", response);

        expect(response.data.data.length).toBe(2);
      });
    });
  });