import {ReactNode} from 'react';
import DOMPurify from 'dompurify';
import classes from './ResultCard.module.css';

export interface ResultCardProps {
    title: string;
    link: string;
    description?: string;
    tags?: string[];
    thumbnail?: ReactNode;
}

export default function ResultCard({title, link, description, tags, thumbnail}: ResultCardProps) {
    return (
        <li className={classes.card}>
            <a href={link} className={classes.link}>
                <div className={classes.title}>
                    <h3>{title}</h3>
                </div>

                {(description || thumbnail || tags) && <div className={classes.body}>
                    {thumbnail && <div className={classes.thumbnail}>
                        {thumbnail}
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
