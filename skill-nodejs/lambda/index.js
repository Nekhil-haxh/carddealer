
const Alexa = require('ask-sdk-core');
const Util = require('./util');
const Common = require('./common');

// The namespace of the custom directive to be sent by this skill
const NAMESPACE = 'Custom.Mindstorms.Gadget';

// The name of the custom directive to be sent this skill
const NAME_CONTROL = 'control';


 const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle: async function(handlerInput) {

        let request = handlerInput.requestEnvelope;
        let { apiEndpoint, apiAccessToken } = request.context.System;
        let apiResponse = await Util.getConnectedEndpoints(apiEndpoint, apiAccessToken);
        if ((apiResponse.endpoints || []).length === 0) {
            return handlerInput.responseBuilder
            .speak(`I couldn't find an EV3 Brick connected to this Echo device. Please check to make sure your EV3 Brick is connected, and try again.`)
            .getResponse();
        }

        // Store the gadget endpointId to be used in this skill session
        let endpointId = apiResponse.endpoints[0].endpointId || [];
        Util.putSessionAttribute(handlerInput, 'endpointId', endpointId);
        let out = "Welcome to card dealers, To know about commands use help,"
        
        return handlerInput.responseBuilder
            .speak(out)
            .reprompt("Awaiting commands")
            .getResponse();
    }
};


const SetPlayerIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'SetPlayerIntent';
    },
    handle: function (handlerInput) {

        
        let player = Alexa.getSlotValue(handlerInput.requestEnvelope, 'Player');
        player = Math.max(1, Math.min(10, parseInt(player)));
        Util.putSessionAttribute(handlerInput, 'player', player);

        return handlerInput.responseBuilder
            .speak(`Setting players to ${player} `)
            .reprompt(`Players set to  ${player} `)
            .getResponse();
    }
};
const GiveIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GiveIntent';
    },
    handle: function (handlerInput) {
        
        
        let value = Alexa.getSlotValue(handlerInput.requestEnvelope, 'Value');
        value = Math.max(1, Math.min(10, parseInt(value)));
        Util.putSessionAttribute(handlerInput, 'value', value);
        
        const request = handlerInput.requestEnvelope;
        const attributesManager = handlerInput.attributesManager;
        let endpointId = attributesManager.getSessionAttributes().endpointId || [];
        const Value = attributesManager.getSessionAttributes().value;

        let directive = Util.build(endpointId, NAMESPACE, NAME_CONTROL,
            {
                type: 'give',
                value: Value,
            });
    
         return handlerInput.responseBuilder
            .speak(`Giving you ${Value} cards `)
            .addDirective(directive)
            .getResponse();
    }
};

const DistributeIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'DistributeIntent';
    },
    handle:function (handlerInput) {
        const request = handlerInput.requestEnvelope;
        const attributesManager = handlerInput.attributesManager;
        let endpointId = attributesManager.getSessionAttributes().endpointId || [];
        const player = attributesManager.getSessionAttributes().player || "3";
       

        // Construct the directive with the payload containing the move parameters
        let directive = Util.build(endpointId, NAMESPACE, NAME_CONTROL,
            {
                type: 'distribute',
                player:player,
            });

        return handlerInput.responseBuilder
            .speak(`Starting distribution`)
            .addDirective(directive)
            .getResponse();
    }
};

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        SetPlayerIntentHandler,
        GiveIntentHandler,
        DistributeIntentHandler,
        Common.HelpIntentHandler,
        Common.CancelAndStopIntentHandler,
        Common.SessionEndedRequestHandler,
        Common.IntentReflectorHandler, // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
        
    )
    .addRequestInterceptors(Common.RequestInterceptor)
    .addErrorHandlers(
        Common.ErrorHandler,
    )
    .lambda();
