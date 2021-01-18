# Feedback.Gifts

Feedback Gifts is a tool for a manager to run direct 360-feedback session. It allows 
team members to opt in to a direct feedback conversation with a peer without pressure
of knowing who opted in for them.

## Why use it?

Feedback Gifts was built as an add-on to support a standard performance review process. Some
times a performance review is done by having team members submit 360 feedback about each other 
and then the manager of the team is responsible for synthesizing, anonymizing and delivering that feedback.

The problem with the manager delivering anonymized feedback is that the process of making feedback
anonymous removes details and for feedback to be effective it needs to be specific which means details. 
Another downside to this approach is that it misses the opportunity for a team to grow closer
by working through tough situations together openly and by praising each other directly.

The very well-intentioned reason to anonymize feedback is that teammembers feel comfortable speaking
freely. The idea is hard topics are more likely to be brought up rather than swept under the rug. Another
benefit of the manager delivering all the feedback is that it saves a ton of time on everyone's 
calendars.

This is where Feedback Gifts comes in. It allows team members to opt-in to a direct feedback
discussion. The choice to opt-in to a conversation is critical because it allows people to form closer 
bonds by opting in to potentially tough conversation while also allowing people to protect their
calendars and have managers handle conversation they aren't ready to handle directly.

## How does it work?

A 360-feedback session is run in 3 steps:

1. The manager for the team creates a new feedback session and chooses teammates to invites.
2. The participants in the session are sent an email with a personal url that allows them to choose
   which other participants they would like to talk to.
3. The manager finalizes the session and all participants are sent an email with their matches. They
   are instructed to set up a 30 min feedback conversation with each match to deliver their feedback. 
   Each match results in two 30 min conversations so each participant has a chance to hear feedback.
   
A new feedback session can be run whenever although it's entended use is to be run during a 360 performance 
review cycle after participants have submitted feedback about each other and before the manager has
had the final performance conversation.

## Design Resources

- Figma file: https://www.figma.com/file/Jh2q2Uugj7siUSnCn78mqE
- Styling library: https://stitches.dev
- Component Library: https://radix-ui.com
- Icon set: https://icons.modulz.app/

## Tooling

Feedback Gifts runs on firebase as a single page app. There are 2 environments, `feedback-tool-prod` 
and `feedback-tool-dev`. 

For fine grained tools, see scripts in `package.json`. 

### Deploys

To deploy, run `npm run deploy-dev` or `npm run deploy-prod`.

### Development

Check out the repo and run `npm install`. To developer locally, run `npm run develop` to start a development
build and file watch then in a separate terminal run `npm run serve` to start local firebase server that 
will serve the app on `localhost:5000`
