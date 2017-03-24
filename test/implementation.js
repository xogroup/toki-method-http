'use strict';

const expect = require('code').expect;   // assertion library
const Promise = require('bluebird');
const Lab = require('lab');
const Hapi = require('hapi');
const Sinon = require('sinon');
const lab = exports.lab = Lab.script();
const { describe, it, before, beforeEach } = lab;

const HttpMethod = require('../src/implementation');
let server;
const actionSpies = {};

describe('HTTP Method', () => {

    before((done) => {

        server = new Hapi.Server();
        server.connection({
            port: 5000
        });

        actionSpies.get = Sinon.spy();
        actionSpies.post = Sinon.spy();

        server.route({
            method: 'GET',
            path: '/test',
            handler: (req, reply) => {

                reply(200);
                return actionSpies.get(req.payload, req.headers);
            }
        });

        server.route({
            method: 'GET',
            path: '/payload',
            handler: (req, reply) => {

                reply({
                    foo  : 'bar',
                    baz  : 'biz',
                    break: null
                });
                return actionSpies.get(req.payload, req.headers);
            }
        });

        server.route({
            method: 'POST',
            path: '/test',
            handler: (req, reply) => {

                reply(201);
                return actionSpies.post(req.payload, req.headers);
            }
        });

        return server.start(done);
    });

    beforeEach( (done) => {

        actionSpies.get.reset();
        actionSpies.post.reset();

        return done();
    });

    it('should throw an error if no url is provided', { plan: 1 }, () => {

        return Promise
        .resolve()
        .bind({
            action: {
                type: 'toki-method-http'
            },
            contexts: {}
        })
        .then(HttpMethod)
        .catch( (e) => {

            expect(e).to.be.instanceof(Error);
        });
    });

    it('makes a get request', () => {

        return Promise
        .resolve()
        .bind({
            action: {
                type: 'toki-method-http',
                inputConfiguration: {
                    url: 'http://localhost:5000/test'
                }
            },
            contexts: {}
        })
        .then(HttpMethod)
        .then( () => {

            expect(actionSpies.get.calledOnce).to.be.true();
        });
    });

    it('makes a post request', () => {

        return Promise
        .resolve()
        .bind({
            action: {
                type: 'toki-method-http',
                inputConfiguration: {
                    url: 'http://localhost:5000/test',
                    method: 'post'
                }
            },
            contexts: {}
        })
        .then(HttpMethod)
        .then( () => {

            expect(actionSpies.post.calledOnce).to.be.true();
        });
    });

    it('makes a post request', () => {

        return Promise
        .resolve()
        .bind({
            action: {
                type: 'toki-method-http',
                inputConfiguration: {
                    url: 'http://localhost:5000/test',
                    method: 'post'
                }
            },
            contexts: {}
        })
        .then(HttpMethod)
        .then( () => {

            expect(actionSpies.post.calledOnce).to.be.true();
        });
    });

    it('makes a post request with a fixed header', () => {

        const testHeader = { 'x-arbitrary': 'Foobar' };
        return Promise
        .resolve()
        .bind({
            action: {
                type: 'toki-method-http',
                inputConfiguration: {
                    url: 'http://localhost:5000/test',
                    method: 'post',
                    headers: testHeader
                }
            },
            contexts: {}
        })
        .then(HttpMethod)
        .then( () => {

            expect(actionSpies.post.calledOnce).to.be.true();
            const spyArgs = actionSpies.post.getCall(0).args;
            expect(spyArgs[1]).to.include(testHeader);
        });
    });

    it('makes a post request with a json body using no type', () => {

        const testBody = { foo: 'bar', biz: 'baz' };
        return Promise
        .resolve()
        .bind({
            action: {
                type: 'toki-method-http',
                inputConfiguration: {
                    url: 'http://localhost:5000/test',
                    method: 'post',
                    payload: testBody
                }
            },
            contexts: {}
        })
        .then(HttpMethod)
        .then( () => {

            expect(actionSpies.post.calledOnce).to.be.true();
            const spyArgs = actionSpies.post.getCall(0).args;
            expect(spyArgs[0]).to.equal(testBody);
        });
    });

    it('makes a post request with a json body, setting type', () => {

        const testBody = { foo: 'bar', biz: 'baz' };
        return Promise
        .resolve()
        .bind({
            action: {
                type: 'toki-method-http',
                inputConfiguration: {
                    url: 'http://localhost:5000/test',
                    method: 'post',
                    payload: testBody,
                    type: 'json'
                }
            },
            contexts: {}
        })
        .then(HttpMethod)
        .then( () => {

            expect(actionSpies.post.calledOnce).to.be.true();
            const spyArgs = actionSpies.post.getCall(0).args;
            expect(spyArgs[0]).to.equal(testBody);
        });
    });

    it('makes a request with all passthrough headers', () => {

        return Promise
        .resolve()
        .bind({
            action: {
                type: 'toki-method-http',
                inputConfiguration: {
                    url: 'http://localhost:5000/test',
                    method: 'get',
                    passThroughHeaders: true
                }
            },
            request: {
                headers: {
                    'x-arbitrary': 'foo',
                    'x-bar': 'biz'
                }
            },
            contexts: {}
        })
        .then(HttpMethod)
        .then( () => {

            expect(actionSpies.get.calledOnce).to.be.true();
            const spyArgs = actionSpies.get.getCall(0).args;
            expect(spyArgs[1]).to.include({ 'x-arbitrary': 'foo' });
            expect(spyArgs[1]).to.include({ 'x-bar': 'biz' });
        });
    });

    it('makes a request with specific passthrough headers', () => {

        return Promise
        .resolve()
        .bind({
            action: {
                type: 'toki-method-http',
                inputConfiguration: {
                    url: 'http://localhost:5000/test',
                    method: 'get',
                    passThroughHeaders: ['x-bar']
                }
            },
            request: {
                headers: {
                    'x-arbitrary': 'foo',
                    'x-bar': 'biz'
                }
            },
            contexts: {}
        })
        .then(HttpMethod)
        .then( () => {

            expect(actionSpies.get.calledOnce).to.be.true();
            const spyArgs = actionSpies.get.getCall(0).args;
            expect(spyArgs[1]).to.not.include({ 'x-arbitrary': 'foo' });
            expect(spyArgs[1]).to.include({ 'x-bar': 'biz' });
        });
    });

    it('makes a request and sends back the response', () => {

        let clientResponse;

        const context = {
            action: {
                name: 'test',
                type: 'toki-method-http',
                inputConfiguration: {
                    url: 'http://localhost:5000/payload',
                    method: 'get'
                },
                clientResponseConfiguration: true
            },
            response: {
                send: (blah) => {

                    clientResponse = blah;
                }
            },
            contexts: {}
        };

        return Promise
        .resolve()
        .bind(context)
        .then(HttpMethod)
        .then( (output) => {

            expect(actionSpies.get.calledOnce).to.be.true();
            expect(output).to.equal({
                foo  : 'bar',
                baz  : 'biz',
                break: null
            });
            expect(clientResponse).to.equal({
                foo  : 'bar',
                baz  : 'biz',
                break: null
            });
        });
    });

    it('makes a request and sends back the mapped response', () => {

        let clientResponse;

        const context = {
            action: {
                name: 'test',
                type: 'toki-method-http',
                inputConfiguration: {
                    url: 'http://localhost:5000/payload',
                    method: 'get'
                },
                clientResponseConfiguration: {
                    data: {
                        foo  : 'bar',
                        baz  : 'biz',
                        break: '{{break}}'
                    }
                }
            },
            contexts: {},
            response: {
                send: (blah) => {

                    clientResponse = blah;
                }
            }
        };

        return Promise
        .resolve()
        .bind(context)
        .then(HttpMethod)
        .then( (output) => {

            expect(actionSpies.get.calledOnce).to.be.true();
            expect(output).to.equal({
                foo  : 'bar',
                baz  : 'biz',
                break: null
            });
            expect(clientResponse).to.equal({
                data: {
                    foo  : 'bar',
                    baz  : 'biz',
                    break: null
                }
            });
        });
    });
});
