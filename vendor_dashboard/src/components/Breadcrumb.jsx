import { Link } from 'react-router-dom';

/**
 * Breadcrumb component
 * @param {Object} props
 * @param {Array} props.items - Array of breadcrumb items with label and optional url
 */
export default function Breadcrumb({ items }) {
    return (
        <ul className="breadcrumbs flex items-center flex-wrap justify-start gap10">
            {items.map((item, index) => (
                <li key={index}>
                    {index > 0 && <i className="icon-chevron-right" />}
                    {item.url ? (
                        <Link to={item.url}>
                            <div className="text-tiny">{item.label}</div>
                        </Link>
                    ) : (
                        <div className="text-tiny">{item.label}</div>
                    )}
                </li>
            ))}
        </ul>
    );
}
