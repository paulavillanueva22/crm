<?php

namespace DBAL\Entity;

use Doctrine\ORM\Mapping as ORM;
use DBAL\Entity\Evento;

/**
 * Description of Cliente
 *
 * This class represents a registered user.
 * @ORM\Entity()
 * @ORM\Table(name="CLIENTE")
 */
class Cliente {

    /**
     * @ORM\Id
     * @ORM\Column(name="ID_CLIENTE", type="integer")
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $Id;

    /**
     * @ORM\Column(name="NOMBRE_CLIENTE", nullable=true, type="string", length=255)
     */
    private $nombre;

    /**
     * @ORM\Column(name="APELLIDO_CLIENTE", nullable=true, type="string", length=255)
     */
    private $apellido;

    /**
     * Many Features have One Product.
     * @ORM\ManyToOne(targetEntity="Pais")
     * @ORM\JoinColumn(name="ID_PAIS_CLIENTE", referencedColumnName="ID_PAIS")
     */
    private $pais;

    /**
     * Many Features have One Product.
     * @ORM\ManyToOne(targetEntity="Provincia")
     * @ORM\JoinColumn(name="ID_PROVINCIA_CLIENTE", referencedColumnName="ID_PROVINCIA")
     */
    private $provincia;

    /**
     * @ORM\Column(name="CIUDAD_CLIENTE", nullable=true, type="string", length=255)
     */
    private $ciudad;

    /**
     * @ORM\Column(name="TELEFONO", nullable=true, type="string", length=255)
     */
    private $telefono;

    /**
     * @ORM\Column(name="MAIL", nullable=true, type="string", length=255)
     */
    private $email;

    /**
     * Many Features have One Product.
     * @ORM\ManyToOne(targetEntity="ProfesionCliente")
     * @ORM\JoinColumn(name="ID_PROFESION_CLIENTE", referencedColumnName="ID_TIPO_CLIENTE")
     */
    private $profesion;

    /**
     * @ORM\Column(name="EMPRESA_CLIENTE", nullable=true, type="string", length=255)
     */
    private $empresa;

    /**
     * @ORM\Column(name="ACTIVIDAD_CLIENTE", nullable=true, type="string", length=255)
     */
    private $actividad;

    /**
     * @ORM\Column(name="ANIMALES_CLIENTE", nullable=true, type="string", length=255)
     */
    private $animales;

    /**
     * @ORM\Column(name="ESTABLE_CLIENTE", nullable=true, type="string", length=255)
     */
    private $establecimientos;

    /**
     * Many Clientes have One Categoria.
     * @ORM\ManyToOne(targetEntity="CategoriaCliente")
     * @ORM\JoinColumn(name="ID_CATEGORIA_CLIENTE", referencedColumnName="ID_CATEGORIA_CLIENTE")
     */
    private $categoria;

    /**
     * Many Clientes have One Categoria.
     * @ORM\ManyToOne(targetEntity="Licencia")
     * @ORM\JoinColumn(name="ID_LICENCIA", referencedColumnName="ID_LICENCIA")
     */
    private $licencia;

    /**
     * @ORM\Column(name="VERSION_LICENCIA", nullable=true, type="string", length=255)
     */
    private $version;

    /**
     * @ORM\Column(name="FECHA_COMPRA", type="datetime")
     */
    private $fecha_compra;

    /**
     * @ORM\Column(name="FECHA_VTO_ACT", type="datetime")
     */
    private $vencimiento;

    /**
     * @ORM\Column(name="FECHA_ULTIMO_CONTACTO", type="datetime")
     */
    private $fecha_ultimo_contacto;

    /**
     * @ORM\Column(name="LICENCIA_ACTUAL", nullable=true, type="string", length=255)
     */
    private $licencia_actual;

    /**
     * @ORM\Column(name="ACTIVO", nullable=true, type="string", length=1)
     */
    private $estado;

    /**
     * 
     * @ORM\OneToMany(targetEntity="\DBAL\Entity\Usuario", mappedBy="id_cliente")
     */
    private $usuarios;

    /**
     * 
     * @ORM\OneToMany(targetEntity="\DBAL\Entity\Evento", mappedBy="cliente")
     * @ORM\OrderBy({"fecha" = "desc"})
     */
    private $eventos;

//    public function __construct() {
//        $this->usuario = new ArrayCollection();
//    }

    public function getId() {
        return $this->Id;
    }

    public function getNombre() {
        if (is_null($this->nombre)) {
            return "-";
        } else {
            return $this->nombre;
        }
    }

    public function setNombre($nombre) {
        $this->nombre = $nombre;
    }

    public function getApellido() {
        if (is_null($this->apellido)) {
            return "-";
        } else {
            return $this->apellido;
        }
    }

    public function setApellido($apellido) {
        $this->apellido = $apellido;
    }

    public function getPais() {
        return $this->pais;
    }

    public function setPais($pais) {
        $this->pais = $pais;
    }

    public function getNombrePaisCliente() {
        if (is_null($this->provincia)) {
            if (!is_null($this->pais)) {
                return $this->pais->getNombre();
            } else {
                return '-';
            }
        } else {
            if (is_null($this->provincia->getPais())) {
                return '-';
            } else {
                return $this->provincia->getPais()->getNombre();
            }
        }
    }

    public function getProvincia() {
        return $this->provincia;
    }

    public function setProvincia($provincia) {
        $this->provincia = $provincia;
    }

    public function getNombreProvinciaCliente() {
        $provincia = $this->getProvincia();
        if (is_null($provincia)) {
            return "-";
        } else {
            return $this->getProvincia()->getNombre_provincia();
        }
    }

    public function getCiudad() {
        if (is_null($this->ciudad)) {
            return "-";
        } else {
            return $this->ciudad;
        }
    }

    public function setCiudad($ciudad) {
        $this->ciudad = $ciudad;
    }

    public function getProfesion() {
        return $this->profesion;
    }

    public function setProfesion($profesion) {
        $this->profesion = $profesion;
    }

    public function getNombreProfesionCliente() {
        $profesion = $this->getProfesion();
        if (is_null($profesion)) {
            return "-";
        } else {
            return $this->getProfesion()->getNombre();
        }
    }

    public function getEmpresa() {
        if (is_null($this->empresa)) {
            return "-";
        } else {
            return $this->empresa;
        }
    }

    public function setEmpresa($empresa) {
        $this->empresa = $empresa;
    }

    public function getActividad() {
        if (is_null($this->actividad)) {
            return "-";
        } else {
            return $this->actividad;
        }
    }

    public function setActividad($actividad) {
        $this->actividad = $actividad;
    }

    public function getAnimales() {
        if (is_null($this->animales)) {
            return "-";
        } else {
            return $this->animales;
        }
    }

    public function setAnimales($animales) {
        $this->animales = $animales;
    }

    public function getEstablecimientos() {
        if (is_null($this->establecimientos)) {
            return "-";
        } else {
            return $this->establecimientos;
        }
    }

    public function setEstablecimientos($establecimientos) {
        $this->establecimientos = $establecimientos;
    }

    public function getTelefono() {
        if (is_null($this->telefono)) {
            return "-";
        } else {
            return $this->telefono;
        }
    }

    public function setTelefono($telefono) {
        $this->telefono = $telefono;
    }

    public function getEmail() {
        if (is_null($this->email)) {
            return "-";
        } else {
            return $this->email;
        }
    }

    public function setEmail($email) {
        $this->email = $email;
    }

    public function getCategoria() {
        return $this->categoria;
    }

    public function setCategoria($categoria) {
        $this->categoria = $categoria;
    }

    public function getNombreCategoriaCliente() {
        $categoria = $this->getCategoria();
        if (is_null($categoria)) {
            return "-";
        } else {
            return $categoria->getNombre();
        }
    }

    public function getFechaCompra() {
        return $this->fecha_compra;
    }

    public function setFechaCompra($fecha_compra) {
        $this->fecha_compra = $fecha_compra;
    }

    public function getVencimiento() {
        return $this->vencimiento;
    }

    public function setVencimiento($vencimiento) {
        $this->vencimiento = $vencimiento;
    }

    function getFechaUltimoContacto() {
        return $this->fecha_ultimo_contacto;
    }

    function setFechaUltimoContacto($fecha_ultimo_contacto) {
        $this->fecha_ultimo_contacto = $fecha_ultimo_contacto;
    }

    function getNombreLicenciaCliente() {
        if (is_null($this->licencia)) {
            return "-";
        } else {
            return $this->licencia->getNombre();
        }
    }

    function getLicencia() {
        return $this->licencia;
    }

    function setLicencia($licencia) {
        $this->licencia = $licencia;
    }

    public function getVersion() {
        return $this->version;
    }

    public function setVersion($version) {
        $this->version = $version;
    }

    public function getEstado() {
        return $this->estado;
    }

    public function getEstadoNombre() {
        if ($this->estado == "S") {
            return "Activo";
        } else {
            return "Inactivo";
        }
    }

    public function setEstado($estado) {
        $this->estado = $estado;
    }

    public function addUsuario($usuario) {
        $this->usuarios[] = $usuario;
    }

    public function getUsuarios() {
        return $this->usuarios;
    }

    public function getEventos() {
        return $this->eventos;
    }

    public function isPrimeraVenta() {
        $array_eventos = $this->getEventos();
        foreach ($array_eventos as $eve) {
            if ($eve->getTipoId() == 2) {
                return false;
                break;
            }
        }
        return true;
    }
    
}
