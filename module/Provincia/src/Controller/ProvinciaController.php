<?php

/**
 * Esta clase es el controlador de la entidad Provincia.  
 * Se encarga de direccionar los datos entre las vistas y el manager
 * @author SoftHuella 
 */

namespace Provincia\Controller;

use Application\Controller\HuellaController;
use Zend\View\Model\ViewModel;


class ProvinciaController extends HuellaController {

    /**
     * @var DoctrineORMEntityManager
     */
    protected $entityManager;

    /**
     * Provincia manager.
     * @var User\Service\ProvinciaManager 
     */
    protected $provinciaManager;

    public function __construct($entityManager, $provinciaManager) {
        $this->entityManager = $entityManager;
        $this->provinciaManager = $provinciaManager;
    }

    
    public function indexAction() {
        return $this->procesarIndexAction();
    }

    private function procesarIndexAction() {
        $provincias = $this->provinciaManager->getProvincias();
        return new ViewModel([
            'provincias' => $provincias
        ]);
    }

    public function addAction() {
        $view = $this->procesarAddAction();
        return $view;
    }

    private function procesarAddAction() {
        $form = $this->provinciaManager->createForm();
        $provincias = $this->provinciaManager->getProvincias();
        $paises = $this->provinciaManager->getPais();
        if ($this->getRequest()->isPost()) {
            $data = $this->params()->fromPost();
            $this->provinciaManager->getProvinciaFromForm($form, $data);
            return $this->redirect()->toRoute('provincia');
        }
        return new ViewModel([
            'form' => $form,
            'provincias' => $provincias,
            'paises' => $paises,
        ]);
    }

    public function editAction() {
        $view = $this->procesarEditAction();
        return $view;
    }

    public function procesarEditAction() {
        $id = $this->params()->fromRoute('id', -1);
        $provincia = $this->provinciaManager->getProvinciaId($id);
        $form = $this->provinciaManager->getFormForProvincia($provincia);
        if ($form == null) {
            $this->getResponse()->setStatusCode(404);
            return;
        } else {
            if ($this->getRequest()->isPost()) {
                $data = $this->params()->fromPost();
                if ($this->provinciaManager->formValid($form, $data)) {
                    $this->provinciaManager->updateProvincia($provincia, $form);
                    return $this->redirect()->toRoute('application', ['action' => 'view']);
                }
            } else {
                $this->provinciaManager->getFormEdited($form, $provincia);
            }
            return new ViewModel(array(
                'provincia' => $provincia,
                'form' => $form
            ));
        }
    }

    public function removeAction() {
        $view = $this->procesarRemoveAction();
        return $view;
    }

    public function procesarRemoveAction() {
        $provincia = $this->buscarProvincia();
        if ($provincia == null) {
            $this->getResponse()->setStatusCode(404);
            return;
        } else {
            $this->provinciaManager->removeProvincia($provincia);
            return $this->redirect()->toRoute('application', ['action' => 'view']);
        }
    }

    public function viewAction() {
        return new ViewModel();
    }

}
