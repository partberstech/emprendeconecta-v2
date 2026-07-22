import { Link } from 'react-router-dom'

const quickLinks = [
  { label: 'Inicio', href: '/' },
  { label: 'Catálogo', href: '/catalogo' },
  { label: 'Mi Cuenta', href: '/login' },
]

const socialLinks = ['Facebook', 'Instagram', 'Twitter (X)']

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-surface-900 dark:bg-surface-950 border-t border-surface-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* ── Brand ── */}
          <div>
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <span className="text-2xl font-bold bg-gradient-to-r from-brand-400 to-brand-600 bg-clip-text text-transparent">
                EC
              </span>
              <span className="text-sm font-semibold text-surface-300">
                EmprendeConecta
              </span>
            </Link>
            <p className="text-sm text-surface-400 leading-relaxed max-w-xs">
              Conectamos emprendedores locales con clientes. Descubre productos
              únicos y apoya el comercio local.
            </p>
          </div>

          {/* ── Quick Links ── */}
          <div>
            <h3 className="text-sm font-semibold text-surface-200 uppercase tracking-wider mb-4">
              Enlaces Rápidos
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-surface-400 hover:text-surface-200 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Social ── */}
          <div>
            <h3 className="text-sm font-semibold text-surface-200 uppercase tracking-wider mb-4">
              Síguenos
            </h3>
            <p className="text-sm text-surface-400 mb-4">
              Conéctate con nosotros en redes sociales.
            </p>
            <div className="flex flex-wrap gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social}
                  href="#"
                  className="px-3 py-1.5 text-xs font-medium text-surface-400 bg-surface-800 hover:bg-surface-700 hover:text-surface-200 rounded-lg transition-colors"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── Copyright ── */}
        <div className="mt-10 pt-6 border-t border-surface-800">
          <p className="text-center text-sm text-surface-500">
            &copy; {currentYear} EmprendeConecta. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
