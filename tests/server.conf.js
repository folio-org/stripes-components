export default function config() {
  this.get('/_/version', () => '0.0.0');
  this.get('/_/proxy/modules', []);
}
