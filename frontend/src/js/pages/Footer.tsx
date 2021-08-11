import React from 'react';

import {Box, Link} from '@material-ui/core';
import FacebookIcon from '@material-ui/icons/Facebook';
import TwitterIcon from '@material-ui/icons/Twitter';
import LinkedInIcon from '@material-ui/icons/LinkedIn';

/**
 * The footer with social media icons at the bottom of the page
 * @returns The static footer with all icons
 */
export default (): React.ReactElement => <Box
  marginLeft="20%"
  marginRight="20%"
  display="flex"
  flexDirection="row"
  justifyContent="space-around"
  alignItems="center"
  marginTop="auto"
>
  {([
    ['https://solarspell.org', 'About SolarSPELL'],
    [
      'https://solarspell.org/student-opportunities',
      'Job/Internship Postings',
    ],
    ['https://solarspell.org/newsletter', 'Newsletter'],
    ['mailto:team@solarspell.org', 'team@solarspell.org'],
  ] as [string, string][]).map(([url, text]) =>
    <Box p={1} key={url}>
      <Link
        href={url}
        target="_blank"
      >
        {text}
      </Link>
    </Box>
  )}
  <Box p={1}>
    <Link
      target="_blank"
      href="https://www.facebook.com/SolarSPELL/"
    >
      <FacebookIcon />
    </Link>
    <Link
      target="_blank"
      href="https://twitter.com/SolarSpell"
    >
      <TwitterIcon />
    </Link>
    <Link
      target="_blank"
      href="https://www.linkedin.com/company/solarspell/"
    >
      <LinkedInIcon />
    </Link>
  </Box>
</Box>;
