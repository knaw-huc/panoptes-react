import DOMPurify from 'dompurify';
import classes from './ResultCard.module.css';
import {BlockLoader} from "components/blocks";

export interface ResultCardProps {
    title: string;
    link: string;
    description?: string;
    iiifManifest?: string;
    tags?: string[];
}

export default function ResultCard({title, link, description, iiifManifest, tags}: ResultCardProps) {
    return (
        <li className={classes.card}>
            <a href={link} className={classes.link}>
                <div className={classes.title}>
                    <h3>{title}</h3>
                </div>

                {(description || iiifManifest || tags) && <div className={classes.body}>
                    {/* TODO: Ugly fix for now to render iiifManifest */}
                    {iiifManifest && <div className={classes.thumbnail}>
                        <BlockLoader block={{type: 'iiifImage', value: {manifestUri: iiifManifest, width: 200}}}/>
                    </div>}

                    {(description || tags) && <div className={classes.main}>
                        {description && <div className={classes.description}
                                             dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(description)}}/>}

                        {tags && tags.length > 0 && <div className={classes.tags}>
                            {tags.map(tag => <div key={tag} className={classes.tag}>
                                {tag}
                            </div>)}
                        </div>}
                    </div>}
                </div>}
            </a>
        </li>
    );
}
