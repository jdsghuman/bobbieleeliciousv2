import { PageType, RobotsContent, MetaTags } from '../PropTypes/Tags'
import { concatenateStrings } from './Util'

export const defaultMetaTags: MetaTags = {
  canonical: 'https://www.bobbieleelicious.com',
  description: 'Healthy living and lifestyle',
  image: 'https://www.bobbieleelicious.com/images/bobbieleelicious.png',
  robots: concatenateStrings(RobotsContent.index, RobotsContent.follow),
  title: 'Bobbieleelicious',
  type: PageType.website,
}
