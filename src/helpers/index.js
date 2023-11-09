import React from 'react';

import {
  Facebook,
  Instagram,
  Twitter,
  Pinterest,
  Email,
  Snapchat,
  Youtube,
  Tiktok,
  Linkedin,
  Whatsapp,
  Telegram,
  phoneNumber,
  facebook_bw,
  instagram_bw,
  linkedin_bw,
  snapchat_bw,
  twitter_bw,
  whatsapp_bw,
  pinterest_bw,
  email_bw,
  tiktok_bw,
  youtube_bw,
  Telegram_bw,
} from '../assets';

export const generateIcon = (name) => {
  if (name === 'phoneNumber') {
    return phoneNumber;
  } else if (name === 'facebook_bw') {
    return facebook_bw;
  } else if (name === 'instagram_bw') {
    return instagram_bw;
  } else if (name === 'twitter_bw') {
    return twitter_bw;
  } else if (name === 'pinterest_bw') {
    return pinterest_bw;
  } else if (name === 'email_bw') {
    return email_bw;
  } else if (name === 'snapchat_bw') {
    return snapchat_bw;
  } else if (name === 'youtube_bw') {
    return youtube_bw;
  } else if (name === 'tiktok_bw') {
    return tiktok_bw;
  } else if (name === 'whatsapp_bw') {
    return whatsapp_bw;
  } else if (name === 'linkedin_bw') {
    return linkedin_bw;
  } else if (name === 'telegram_bw') {
    return Telegram_bw;
  }
};

export const generateSVG = ({name = 'facebook', width = 20, height = 20}) => {
  if (name === 'facebook') {
    return <Facebook width={width} height={height} />;
  } else if (name === 'instagram') {
    return <Instagram width={width} height={height} />;
  } else if (name === 'twitter') {
    return <Twitter width={width} height={height} />;
  } else if (name === 'pinterest') {
    return <Pinterest width={width} height={height} />;
  } else if (name === 'email') {
    return <Email width={width} height={height} />;
  } else if (name === 'snapchat') {
    return <Snapchat width={width} height={height} />;
  } else if (name === 'youtube') {
    return <Youtube width={width} height={height} />;
  } else if (name === 'tiktok') {
    return <Tiktok width={width} height={height} />;
  } else if (name === 'whatsapp') {
    return <Whatsapp width={width} height={height} />;
  } else if (name === 'linkedin') {
    return <Linkedin width={width} height={height} />;
  } else if (name === 'telegram') {
    return <Telegram width={width} height={height} />;
  }
};
