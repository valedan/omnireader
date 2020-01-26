import axios from 'axios';
import FanFiction from './fanfiction';
import { readFixture, mockDBCountOnce } from '#/helpers';
import { HttpProxy } from '/models/http_proxy';

jest.mock('axios');
jest.mock('/models/http_proxy');
