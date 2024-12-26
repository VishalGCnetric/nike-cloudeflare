import PropTypes from 'prop-types';
export function Panel({
  children,
  header,
  footer,
}) {
  return (
    <div className="ais-Panel">
      {header && <div className="ais-Panel-header">{header}</div>}
      <div className="ais-Panel-body">{children}</div>
      {footer && <div className="ais-Panel-footer">{footer}</div>}
    </div>
  );
}


// PropTypes for Panel component
Panel.propTypes = {
  children: PropTypes.node.isRequired, // Children content is required
  header: PropTypes.node,               // Header can be any node (optional)
  footer: PropTypes.node,               // Footer can be any node (optional)
};
