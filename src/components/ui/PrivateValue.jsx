function PrivateValue({ value, show }) {
  return <>{show ? value : '••••••'}</>
}

export default PrivateValue