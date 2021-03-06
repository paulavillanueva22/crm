<?php

/**
 */

namespace Profesion\Controller;

use Application\Controller\HuellaController;
use Zend\View\Model\ViewModel;

class ProfesionController extends HuellaController {

    /**
     * @var DoctrineORMEntityManager
     */
    protected $entityManager;

    /**
     * Profesion manager.
     * @var User\Service\ProfesionManager 
     */
    protected $profesionManager;

    /**
     * Doctrine entity manager.
     * @var Doctrine\ORM\EntityManager
     */
    protected $clientesManager;

    public function __construct($entityManager, $profesionManager, $clientesManager) {
        $this->entityManager = $entityManager;
        $this->profesionManager = $profesionManager;
        $this->clientesManager = $clientesManager;
    }

    public function indexAction() {
        $view = $this->procesarAddAction();
        return $view;
    }

    private function procesarIndexAction() {
        $this->prepararBreadcrumbs("Profesiones", "/profesion", "Clientes");
        $profesiones = $this->profesionManager->getProfesiones();
        $volver = $this->getUltimaUrl();
        return new ViewModel([
            'profesiones' => $profesiones,
            'volver' => $volver,
        ]);
    }

    public function addAction() {
        $view = $this->procesarAddAction();
        return $view;
    }

    private function procesarAddAction() {
        $this->prepararBreadcrumbs("Profesiones", "/profesion", "Clientes");
        $profesiones = $this->profesionManager->getProfesiones();
        
        if ($this->getRequest()->isPost()) {
            $data = $this->params()->fromPost();
            $this->profesionManager->addProfesion($data);
            return $this->redirect()->toRoute('profesion');
        }
        $volver = $this->getUltimaUrl();
        return new ViewModel([
            'profesiones' => $profesiones,
            'volver'=> $volver,
        ]);
    }

    public function editAction() {
        $view = $this->procesarEditAction();
        return $view;
    }

    public function procesarEditAction() {
        $id = (int) $this->params()->fromRoute('id', -1);
        $profesion = $this->profesionManager->getProfesionId($id);
        $this->prepararBreadcrumbs("Editar", "/edit/".$id, "Profesiones");
        if ($this->getRequest()->isPost()) {
            $data = $this->params()->fromPost();
            $this->profesionManager->updateProfesion($profesion, $data);
            return $this->redirect()->toRoute('profesion');
        } 
        $volver = $this->getUltimaUrl();
        return new ViewModel(array(
            'profesion' => $profesion,
            'volver' => $volver,
        ));

    }

    public function removeAction() {
        $view = $this->procesarRemoveAction();
        return $view;
    }

    public function procesarRemoveAction() {
        $id = (int) $this->params()->fromRoute('id', -1);
        $profesion = $this->profesionManager->getProfesionId($id);
        if ($profesion == null) {
            $this->reportarError();
        } else {
            $this->clientesManager->eliminarProfesiones($id);
            $this->profesionManager->removeProfesion($profesion);
            return $this->redirect()->toRoute('profesion');
        }
    }

    public function viewAction() {
        return new ViewModel();
    }

    private function reportarError() {
        $this->getResponse()->setStatusCode(404);
        return;
    }
}
