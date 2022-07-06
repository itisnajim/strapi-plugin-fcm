/*
 *
 * HomePage
 *
 */

import React, { memo, useReducer, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';


// import PropTypes from 'prop-types';
import pluginId from '../../pluginId';

import Information from '@strapi/icons/Information';
import ArrowRight from '@strapi/icons/ArrowRight';


import { Grid, GridItem } from '@strapi/design-system/Grid';
import { Button } from '@strapi/design-system/Button';
import { Tooltip } from '@strapi/design-system/Tooltip';
import { TextInput } from '@strapi/design-system/TextInput';
import { Textarea } from '@strapi/design-system/Textarea';


const HomePage = () => {
  const match = useRouteMatch();
  const history = useHistory();

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [payload, setPayload] = useState('');
  const [image, setImage] = useState('');

  const handleEntry = event => {
    event.preventDefault();
    console.log('You have submitted the form.');
    // check title
    if (title.trim().length !== 0) {
      const entry = {
        title: title,
        body: body,
        payload: payload,
        image: image,
      };
      // send data to local storage
      localStorage.setItem('fcmLastNotification', JSON.stringify(entry));
      history.push({ pathname: match.url + '/targets', state: entry });

    } else {
      alert('Please enter a title');
    }
  };
  return (
    <form onSubmit={handleEntry}>
      <Grid gap={{
        desktop: 4,
        tablet: 2,
        mobile: 1
      }} >
        <GridItem padding={1} col={6} s={12}>
          <fieldset>
            <TextInput placeholder="Enter notification title" label="Title" name="title" hint="e.g: Hello World!"
              error={title.length < 1 ? 'Title is a required field.' : undefined}
              onChange={e => setTitle(e.target.value)} value={title}
              labelAction={<Tooltip description="Shown to end users as the notification title">
                <button type="button" aria-label="Information about the title" style={{
                  border: 'none',
                  padding: 0,
                  background: 'transparent'
                }}>
                  <Information aria-hidden={true} />
                </button>
              </Tooltip>} />
          </fieldset>
        </GridItem>
        <GridItem padding={1} col={6} s={12}>
          <fieldset>
            <Textarea placeholder="Enter notification text" label="Body (optional)" name="body" hint="e.g: Notification text" onChange={e => setBody(e.target.value)} labelAction={<Tooltip description="Optionally provide a notification body text" position="right">
              <button type="button" aria-label="Information about the body" style={{
                border: 'none',
                padding: 0,
                background: 'transparent'
              }}>
                <Information aria-hidden={true} />
              </button>
            </Tooltip>}>
              {body}
            </Textarea>
          </fieldset>
        </GridItem>
        <GridItem padding={1} col={12}>
          <fieldset>
            <TextInput placeholder="Enter notification image url" label="Image (optional)" name="image" onChange={e => setImage(e.target.value)} value={image} hint="https://example.com/image.png" labelAction={<Tooltip description="Optionally provide a valid HTTPS image URL">
              <button type="button" aria-label="Information about the image" style={{
                border: 'none',
                padding: 0,
                background: 'transparent'
              }}>
                <Information aria-hidden={true} />
              </button>
            </Tooltip>} />
          </fieldset>
        </GridItem>
        <GridItem paddingTop={2} padding={1} col={6} s={12}>
          <details>
            <summary style={{cursor: 'pointer', paddingBottom: '1em'}}>Extra payload</summary>
            <fieldset>
              <Textarea placeholder="Enter extra payload json" label="Extra Payload (optional)" name="payload" hint='{"notification", "data"}' onChange={e => setPayload(e.target.value)} labelAction={<Tooltip description="Optionally provide an extra payload json" position="right">
                <button type="button" aria-label="Information about the payload" style={{
                  border: 'none',
                  padding: 0,
                  background: 'transparent'
                }}>
                  <Information aria-hidden={true} />
                </button>
              </Tooltip>}>
                {payload}
              </Textarea>
            </fieldset>
          </details>
        </GridItem>
        <GridItem padding={1} col={12}>
          <Button type="submit" variant='default' endIcon={<ArrowRight />}>
            Next
          </Button>
        </GridItem>

      </Grid>
    </form>
  );
};

export default memo(HomePage);
