# Thoughtful

# How to Run this App

## Chrome

```bash
npm run chrome
```

## Firefox

## Manifest

Website blockers are a valuable tool for, among many other things, staying on track with your intentions. If you think you go to YouTube too much, you can add [YouTube.com](http://youtube.com/) to a list on a browser plug-in, and you can no longer go to YouTube.com.

Unless, of course, in a moment of weakness you find yourself desperate to check if the latest videogamedunkey video is up. You type YouTube.com, blocked! With two thoughtless clicks you turn off the blocker, go to YouTube.com, and videogamedunkey hasn’t uploaded this week. But look, a video about an office inside an elevator. Thanks Tom Scott. You suddenly realize it's been an hour since you checked for videogamedunkey’s video and you haven’t got back to work.

While you can use website blockers to help keep you on track, they aren’t made for that. For me, the perfect website blocker wouldn’t be a blocker really. It would function like this:

If out of habit I type YouTube.com, it shows me a full screen prompting me with a few options: I could go back, I could choose another website from another list I made, or I could answer a question.

The question could be something like “Why now?” And I can type “I really want to see if videogamedunkey has a new video.” Some simple validation parameters could be set, such as a minimum length for the string, having actual words, nothing fancy. The plug-in unblocks the site and puts my answer as a sticky somewhere on the screen, and/or asks me at some point if I’ve accomplished my goal.

This plug-in is simultaneously more forgiving and more encouraging. It is also a carrot, instead of a stick, approach when it nudges you to some other website that might be more productive. I think, by giving you the option to answer the question, it also makes you less likely to completely disable it, by also letting you have the small moment to take a break, or even check out a productive video on YouTube.

## Dynamic Rules

```
{
action: {
redirect: { extensionPath: "/page/index.html#https://www.hey.gov" },
type: "redirect",
},
condition: {
resourceTypes: ["main_frame"],
urlFilter: "https://www.hey.gov",
},
id: 1,
priority: 1,
}
```

[Privacy Policy](https://www.freeprivacypolicy.com/live/ca398406-217d-45c1-be9f-60855cfd5313)
