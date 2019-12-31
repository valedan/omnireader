import nock from 'nock';

nock.disableNetConnect();

global.context = describe;
global.it = test;
